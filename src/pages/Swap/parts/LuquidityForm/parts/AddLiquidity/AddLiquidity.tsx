import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  ApprovalState,
  useApproveCallback,
  useCurrency,
  useModalRef,
  useTransactionDeadline,
  wrappedCurrency,
} from 'hooks'
import { Field } from 'types'
import {
  Typography,
  Flex,
  IconButton,
  Button,
  InnerContainer,
  Modal,
  TransactionSubmited,
  TokenInput,
  WalletConnection,
} from 'components'

import icon_plus from 'assets/icons/plus.svg'
import { ConfirmSupply } from '../ConfirmSupply'
import { useWeb3React } from '@web3-react/core'
import {
  useAppSelector,
  useMintState,
  useDerivedMintInfo,
  useMintActionHandlers,
  selectUserSlippageTolerance,
  calculateGasMargin,
  useTransactionAdder,
  useGasPrice,
} from 'store'
import { ETHER, TokenAmount } from 'packages/swap-sdk'
import {
  calculateSlippageAmount,
  getRouterContract,
  maxAmountSpend,
} from 'utils'
import { useCurrencySelectRoute } from 'pages/Swap/hooks'
import { ONE_BIPS, ROUTER_ADDRESS } from 'const'
import { BigNumber } from 'ethers'
import { TransactionResponse } from '@ethersproject/providers'

import wallet_icon from 'assets/icons/wallet.svg'

const DAIInfo = {
  name: 'DAI',
  symbol: 'DAI',
  decimals: 18,
  logoURI: 'https://gliaswaptest.ckbapp.dev/token/dai.png',
  address: '0xC4401D8D5F05B958e6f1b884560F649CdDfD9615',
  chainId: 3,
}

const USDTInfo = {
  name: 'USDT',
  symbol: 'USDT',
  decimals: 6,
  logoURI: 'https://gliaswaptest.ckbapp.dev/token/usdt.png',
  address: '0x1cf98d2a2f5b0BFc365EAb6Ae1913C275bE2618F',
  chainId: 3,
}

const SEVN_ADDRESS = '0x2c3f07314ba8dA7A99E50BB1B9a3Dfd659881E63'
const USDT_ADDRESS = '0x738e997fc917fe7F0b51dfa9A5939507B3E6A154'

const StyledPlusIcon = styled.img`
  margin: 10px 0;
`

const StyledPricesAndPool = styled(Flex)`
  padding-bottom: 20px;
`
const StyledSupplyWrapper = styled.div`
  margin-top: 16px;
`

interface IAddLiquidity {
  userCurrencyA?: string
  userCurrencyB?: string
  onOpenSettings: () => void
}

export const AddLiquidity: FC<IAddLiquidity> = ({
  onOpenSettings,
  userCurrencyA,
  userCurrencyB,
}) => {
  const [liquidityFormShown, setLiquidityFormShown] = useState(false)

  const { account, library, chainId } = useWeb3React()

  const walletsRef = useModalRef()
  const confirmSupplyRef = useModalRef()
  const txSubmitedRef = useModalRef()

  const gasPrice = useGasPrice()

  const [currencyIdA, currencyIdB] = [
    userCurrencyA ? userCurrencyA : SEVN_ADDRESS,
    userCurrencyB ? userCurrencyB : USDT_ADDRESS,
  ]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const { t } = useTranslation()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)
  // modal and loading
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

  useEffect(() => {
    if (txHash) {
      txSubmitedRef.current?.open()
    }
  }, [txHash])

  const { handleCurrencyASelect, handleCurrencyBSelect } =
    useCurrencySelectRoute()

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity
        ? otherTypedValue
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [
      dependentField,
      independentField,
      noLiquidity,
      otherTypedValue,
      parsedAmounts,
      typedValue,
    ]
  )

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const allowedSlippage = useAppSelector(selectUserSlippageTolerance) // custom from users

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    ROUTER_ADDRESS[chainId ?? 1]
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    ROUTER_ADDRESS[chainId ?? 1]
  )

  const showFieldAApproval =
    approvalA === ApprovalState.NOT_APPROVED ||
    approvalA === ApprovalState.PENDING
  const showFieldBApproval =
    approvalB === ApprovalState.NOT_APPROVED ||
    approvalB === ApprovalState.PENDING

  const isValid = !error

  const buttonDisabled =
    !isValid ||
    approvalA !== ApprovalState.APPROVED ||
    approvalB !== ApprovalState.APPROVED

  const addTransaction = useTransactionAdder()

  const poolTokenPercentageAmount =
    noLiquidity && price
      ? '100'
      : (poolTokenPercentage?.lessThan(ONE_BIPS)
          ? '<0.01'
          : poolTokenPercentage?.toFixed(2)) ?? '0'

  const onAdd = async () => {
    if (!chainId || !library || !account) return
    const routerContract = getRouterContract(chainId, library, account)

    const {
      [Field.CURRENCY_A]: parsedAmountA,
      [Field.CURRENCY_B]: parsedAmountB,
    } = parsedAmounts
    if (
      !parsedAmountA ||
      !parsedAmountB ||
      !currencyA ||
      !currencyB ||
      !deadline
    ) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(
        parsedAmountA,
        noLiquidity ? 0 : Number(allowedSlippage)
      )[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(
        parsedAmountB,
        noLiquidity ? 0 : Number(allowedSlippage)
      )[0],
    }

    let estimate
    let method: (...args: any) => Promise<TransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = routerContract.estimateGas.addLiquidityETH
      method = routerContract.addLiquidityETH
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)
          ?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B
        ].toString(), // token min
        amountsMin[
          tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A
        ].toString(), // eth min
        account,
        deadline.toHexString(),
      ]
      value = BigNumber.from(
        (tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString()
      )
    } else {
      estimate = routerContract.estimateGas.addLiquidity
      method = routerContract.addLiquidity
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadline.toHexString(),
      ]
      value = null
    }

    setLiquidityState({
      attemptingTxn: true,
      liquidityErrorMessage: undefined,
      txHash: undefined,
    })

    await estimate(...args, value ? { value } : {})
      .then((estimatedGasLimit) =>
        method(...args, {
          ...(value ? { value } : {}),
          gasLimit: calculateGasMargin(estimatedGasLimit),
          gasPrice,
        }).then((response) => {
          setLiquidityState({
            attemptingTxn: false,
            liquidityErrorMessage: undefined,
            txHash: response.hash,
          })

          addTransaction(response, {
            summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(
              3
            )} ${currencies[Field.CURRENCY_A]?.symbol} and ${parsedAmounts[
              Field.CURRENCY_B
            ]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`,
            type: 'add-liquidity',
          })
        })
      )
      .catch((err) => {
        if (err && err.code !== 4001) {
          // logError(err)
          console.error(`Add Liquidity failed`, err, args, value)
        }
        setLiquidityState({
          attemptingTxn: false,
          liquidityErrorMessage:
            err && err.code !== 4001
              ? t('Add liquidity failed: %message%')
              : undefined,
          txHash: undefined,
        })
      })
  }

  return (
    <>
      <Typography.Header4>{t('liquidityForm.addLiquidity')}</Typography.Header4>

      <Modal title={t('confirmSupply.youWillRecieve')} ref={confirmSupplyRef}>
        <ConfirmSupply
          price={price}
          onSupply={() => {
            onAdd()
            confirmSupplyRef.current?.close()
          }}
          amounts={formattedAmounts}
          currencies={currencies}
          shareOfPool={poolTokenPercentageAmount}
          liquidityMinted={liquidityMinted}
        />
      </Modal>

      <Modal
        title={t('transactionSubmited.transactionSubmited')}
        ref={txSubmitedRef}
      >
        <TransactionSubmited
          onClose={() => txSubmitedRef.current?.close()}
          txHash={txHash}
        />
      </Modal>

      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>

      {attemptingTxn && <Typography.Title>PENDING</Typography.Title>}

      <Flex alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('liquidityForm.addLiquidityToReceiveLpTokens')}
        </Typography.Title>

        <IconButton icon="settings" onClick={onOpenSettings} />
      </Flex>

      {!account && (
        <Button
          title={t('Connect wallet')}
          icon={wallet_icon}
          onClick={() => walletsRef.current?.open()}
        />
      )}

      {account && !liquidityFormShown && (
        <Button
          title={t('liquidityForm.addLiquidity')}
          onClick={() => chainId && setLiquidityFormShown(true)}
        />
      )}

      {liquidityFormShown && account && (
        <>
          <TokenInput
            currency={currencies[Field.CURRENCY_A]}
            tokenName={currencies[Field.CURRENCY_A]?.symbol ?? ''}
            icon={DAIInfo.logoURI}
            amount={formattedAmounts[Field.CURRENCY_A]}
            onInput={onFieldAInput}
            onSelectToken={handleCurrencyASelect}
          />
          <Flex justifyContent="center" alignItems="center">
            <StyledPlusIcon src={icon_plus} />
          </Flex>
          <TokenInput
            currency={currencies[Field.CURRENCY_B]}
            tokenName={currencies[Field.CURRENCY_B]?.symbol ?? ''}
            icon={USDTInfo.logoURI}
            amount={formattedAmounts[Field.CURRENCY_B]}
            onInput={onFieldBInput}
            onSelectToken={handleCurrencyBSelect}
          />
          <Typography.Title>
            {t('liquidityForm.pricesAndPoolShare')}
          </Typography.Title>
          <InnerContainer>
            <StyledPricesAndPool
              justifyContent="space-between"
              alignItems="center"
            >
              <Flex alignItems="center" flexDirection="column">
                <Typography.Title>
                  {price?.toSignificant(6) ?? '-'}
                </Typography.Title>
                <Typography.Body>
                  {currencies?.CURRENCY_A?.symbol}&nbsp;per&nbsp;
                  {currencies?.CURRENCY_B?.symbol}
                </Typography.Body>
              </Flex>
              <Flex alignItems="center" flexDirection="column">
                <Typography.Title>
                  {price?.invert()?.toSignificant(6) ?? '-'}
                </Typography.Title>
                <Typography.Body>
                  {currencies?.CURRENCY_B?.symbol}&nbsp;per&nbsp;
                  {currencies?.CURRENCY_A?.symbol}
                </Typography.Body>
              </Flex>
              <Flex alignItems="center" flexDirection="column">
                <Typography.Title>
                  {poolTokenPercentageAmount}%
                </Typography.Title>
                <Typography.Body>Share of Pool</Typography.Body>
              </Flex>
            </StyledPricesAndPool>
          </InnerContainer>

          {showFieldAApproval ||
            (showFieldBApproval && (
              <StyledSupplyWrapper>
                <Flex justifyContent="space-between" gap="10px">
                  <Button title={t('approve A')} onClick={approveACallback} />
                  <Button title={t('approve B')} onClick={approveBCallback} />
                </Flex>
              </StyledSupplyWrapper>
            ))}

          <StyledSupplyWrapper>
            <Button
              isDisabled={buttonDisabled}
              title={t('supply')}
              onClick={() => {
                confirmSupplyRef.current?.open()
              }}
            />
          </StyledSupplyWrapper>
        </>
      )}
    </>
  )
}
