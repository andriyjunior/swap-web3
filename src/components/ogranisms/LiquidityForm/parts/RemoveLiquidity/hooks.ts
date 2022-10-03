import { TransactionResponse } from '@ethersproject/providers'
import { useWeb3React } from '@web3-react/core'
import { ROUTER_ADDRESS } from 'const'
import { BigNumber, Contract } from 'ethers'
import { splitSignature } from 'ethers/lib/utils'
import {
  ApprovalState,
  useApproveCallback,
  useCurrency,
  usePairContract,
  useTransactionDeadline,
  wrappedCurrency,
} from 'hooks'
import { ETHER } from 'packages/swap-sdk'
import { useCallback, useMemo, useState } from 'react'
import {
  Field,
  selectUserSlippageTolerance,
  useAppSelector,
  useBurnActionHandlers,
  useBurnState,
  useDerivedBurnInfo,
  useGasPrice,
  useTransactionAdder,
} from 'store'
import {
  calculateGasMargin,
  calculateSlippageAmount,
  getRouterContract,
} from 'utils'

export const useRemoveLiquidity = (userCurrencyA, userCurrencyB) => {
  // allowance handling
  const [signatureData, setSignatureData] = useState<{
    v: number
    r: string
    s: string
    deadline: number
  } | null>(null)

  const [{ attemptingTxn, liquidityErrorMessage, txHash }, setLiquidityState] =
    useState<{
      attemptingTxn: boolean
      liquidityErrorMessage: string | undefined
      txHash: string | undefined
    }>({
      attemptingTxn: false,
      liquidityErrorMessage: undefined,
      txHash: undefined,
    })

  const { chainId, library, account } = useWeb3React()

  const [currencyA, currencyB] = [
    useCurrency(userCurrencyA) ?? undefined,
    useCurrency(userCurrencyB) ?? undefined,
  ]

  const [tokenA, tokenB] = useMemo(
    () => [
      wrappedCurrency(currencyA, chainId),
      wrappedCurrency(currencyB, chainId),
    ],
    [currencyA, currencyB, chainId]
  )

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const allowedSlippage = useAppSelector(selectUserSlippageTolerance) // custom from users
  const gasPrice = useGasPrice()

  const { independentField, typedValue } = useBurnState()
  const [removalCheckedA, setRemovalCheckedA] = useState(true)
  const [removalCheckedB, setRemovalCheckedB] = useState(true)

  const { pair, parsedAmounts, error, tokenToReceive } = useDerivedBurnInfo(
    currencyA ?? undefined,
    currencyB ?? undefined,
    removalCheckedA,
    removalCheckedB
  )

  // pair contract
  const pairContract: Contract | null = usePairContract(
    pair?.liquidityToken?.address
  )

  const [approval, approveCallback] = useApproveCallback(
    parsedAmounts[Field.LIQUIDITY],
    chainId && ROUTER_ADDRESS[chainId]
  )

  const { onUserInput: _onUserInput } = useBurnActionHandlers()

  const formattedAmounts = {
    [Field.LIQUIDITY_PERCENT]: parsedAmounts[Field.LIQUIDITY_PERCENT].equalTo(
      '0'
    )
      ? '0'
      : parsedAmounts[Field.LIQUIDITY_PERCENT].toFixed(0),
    [Field.LIQUIDITY]:
      independentField === Field.LIQUIDITY
        ? typedValue
        : parsedAmounts[Field.LIQUIDITY]?.toSignificant(6) ?? '',
    [Field.CURRENCY_A]:
      independentField === Field.CURRENCY_A
        ? typedValue
        : parsedAmounts[Field.CURRENCY_A]?.toSignificant(6) ?? '',
    [Field.CURRENCY_B]:
      independentField === Field.CURRENCY_B
        ? typedValue
        : parsedAmounts[Field.CURRENCY_B]?.toSignificant(6) ?? '',
  }

  // wrapped onUserInput to clear signatures
  const onUserInput = useCallback(
    (field: Field, value: string) => {
      // setSignatureData(null)
      return _onUserInput(field, value)
    },
    [_onUserInput]
  )

  const onLiquidityInput = useCallback(
    (value: string): void => onUserInput(Field.LIQUIDITY, value),
    [onUserInput]
  )

  // tx sending
  const addTransaction = useTransactionAdder()

  const onAttempToApprove = async () => {
    if (!pairContract || !pair || !library || !deadline)
      throw new Error('missing dependencies')
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      // toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    // try to gather a signature for permission
    const nonce = await pairContract.nonces(account)

    const EIP712Domain = [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ]
    const domain = {
      name: 'Pancake LPs',
      version: '1',
      chainId,
      verifyingContract: pair.liquidityToken.address,
    }
    const Permit = [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint256' },
    ]
    const message = {
      owner: account,
      spender: chainId && ROUTER_ADDRESS[chainId],
      value: liquidityAmount.raw.toString(),
      nonce: nonce.toHexString(),
      deadline: deadline.toNumber(),
    }
    const data = JSON.stringify({
      types: {
        EIP712Domain,
        Permit,
      },
      domain,
      primaryType: 'Permit',
      message,
    })

    library
      .send('eth_signTypedData_v4', [account, data])
      .then(splitSignature)
      .then((signature) => {
        setSignatureData({
          v: signature.v,
          r: signature.r,
          s: signature.s,
          deadline: deadline.toNumber(),
        })
      })
      .catch((err) => {
        // for all errors other than 4001 (EIP-1193 user rejected request), fall back to manual approve
        if (err?.code !== 4001) {
          approveCallback()
        }
      })
  }

  const onRemove = async () => {
    if (!chainId || !library || !account || !deadline) {
      throw new Error('missing dependencies')
    }

    const {
      [Field.CURRENCY_A]: currencyAmountA,
      [Field.CURRENCY_B]: currencyAmountB,
    } = parsedAmounts

    if (!currencyAmountA || !currencyAmountB) {
      // toastError(t('Error'), t('Missing currency amounts'))
      throw new Error('missing currency amounts')
    }

    const routerContract = getRouterContract(chainId, library, account)

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        currencyAmountA,
        Number(allowedSlippage)
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        currencyAmountB,
        Number(allowedSlippage)
      )[0],
    }

    if (!currencyA || !currencyB) {
      // toastError(t('Error'), t('Missing tokens'))
      throw new Error('missing tokens')
    }
    const liquidityAmount = parsedAmounts[Field.LIQUIDITY]
    if (!liquidityAmount) {
      // toastError(t('Error'), t('Missing liquidity amount'))
      throw new Error('missing liquidity amount')
    }

    const currencyBIsETH = currencyB === ETHER
    const oneCurrencyIsETH = currencyA === ETHER || currencyBIsETH

    if (!tokenA || !tokenB) {
      // toastError(t('Error'), t('Could not wrap'))
      throw new Error('could not wrap')
    }

    let methodNames: string[]
    let args: Array<string | string[] | number | boolean>

    // we have approval, use normal remove liquidity
    if (approval === ApprovalState.APPROVED) {
      // removeLiquidityETH
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETH',
          'removeLiquidityETHSupportingFeeOnTransferTokens',
        ]
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          deadline.toHexString(),
        ]
      }
      // removeLiquidity
      else {
        methodNames = ['removeLiquidity']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          deadline.toHexString(),
        ]
      }
    } // we have a signature, use permit versions of remove liquidity
    else if (signatureData !== null) {
      // removeLiquidityETHWithPermit
      if (oneCurrencyIsETH) {
        methodNames = [
          'removeLiquidityETHWithPermit',
          'removeLiquidityETHWithPermitSupportingFeeOnTransferTokens',
        ]
        args = [
          currencyBIsETH ? tokenA.address : tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
          ].toString(),
          amountsMin[
            currencyBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
          ].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
      // removeLiquidityETHWithPermit
      else {
        methodNames = ['removeLiquidityWithPermit']
        args = [
          tokenA.address,
          tokenB.address,
          liquidityAmount.raw.toString(),
          amountsMin[Field.CURRENCY_A].toString(),
          amountsMin[Field.CURRENCY_B].toString(),
          account,
          signatureData.deadline,
          false,
          signatureData.v,
          signatureData.r,
          signatureData.s,
        ]
      }
    } else {
      // toastError(
      //   t('Error'),
      //   t('Attempting to confirm without approval or a signature')
      // )
      throw new Error('Attempting to confirm without approval or a signature')
    }

    const safeGasEstimates: (BigNumber | undefined)[] = await Promise.all(
      methodNames.map((methodName) =>
        routerContract.estimateGas[methodName](...args)
          .then(calculateGasMargin)
          .catch((err) => {
            console.error(`estimateGas failed`, methodName, args, err)
            return undefined
          })
      )
    )

    const indexOfSuccessfulEstimation = safeGasEstimates.findIndex(
      (safeGasEstimate) => BigNumber.isBigNumber(safeGasEstimate)
    )

    // all estimations failed...
    if (indexOfSuccessfulEstimation === -1) {
      console.error('This transaction would fail')
      // toastError(t('Error'), t('This transaction would fail'))
    } else {
      const methodName = methodNames[indexOfSuccessfulEstimation]
      const safeGasEstimate = safeGasEstimates[indexOfSuccessfulEstimation]

      setLiquidityState({
        attemptingTxn: true,
        liquidityErrorMessage: undefined,
        txHash: undefined,
      })
      await routerContract[methodName](...args, {
        gasLimit: safeGasEstimate,
        gasPrice,
      })
        .then((response: TransactionResponse) => {
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage: undefined,
            txHash: response.hash,
          })
          addTransaction(response, {
            summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
              3
            )} ${currencyA?.symbol} and ${parsedAmounts[
              Field.CURRENCY_B
            ]?.toSignificant(3)} ${currencyB?.symbol}`,
            type: 'remove-liquidity',
          })
        })
        .catch((err) => {
          if (err && err.code !== 4001) {
            // logError(err)
            console.error(`Remove Liquidity failed`, err, args)
          }
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage: err && err?.code !== 4001 ? err : undefined,
            txHash: undefined,
          })
        })
    }
  }

  return {
    onRemove,
    currencyA,
    currencyB,
    parsedAmounts,
    formattedAmounts,
    txHash,
    _onUserInput,
    pair,
    tokenA,
    tokenB,
    onAttempToApprove,
    onLiquidityInput,
  }
}
