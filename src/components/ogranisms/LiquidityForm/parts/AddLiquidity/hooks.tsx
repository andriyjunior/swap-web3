import { TransactionResponse } from '@ethersproject/providers'
import { BigNumber } from 'ethers'
import {
  useActiveWeb3React,
  useTransactionDeadline,
  wrappedCurrency,
} from 'hooks'
import { ETHER } from 'packages/swap-sdk'
import { useState } from 'react'
import {
  calculateGasMargin,
  selectUserSlippageTolerance,
  useAppSelector,
  useGasPrice,
  useTransactionAdder,
} from 'store'
import { Field } from 'types'
import { calculateSlippageAmount, getRouterContract } from 'utils'

export const useOnAdd = (
  currencyA,
  currencyB,
  parsedAmounts,
  noLiquidity,
  currencies
) => {
  const addTransaction = useTransactionAdder()

  const { account, chainId, library } = useActiveWeb3React()

  // txn values
  const deadline = useTransactionDeadline() // custom from users settings
  const allowedSlippage = useAppSelector(selectUserSlippageTolerance) // custom from users
  const gasPrice = useGasPrice()

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
              ? 'Add liquidity failed: %message%'
              : undefined,
          txHash: undefined,
        })
      })
  }

  return { attemptingTxn, liquidityErrorMessage, txHash, onAdd }
}
