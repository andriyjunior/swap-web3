import { useWeb3React } from '@web3-react/core'
import { Currency, currencyEquals, ETHER, WNATIVE } from 'packages/swap-sdk'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCurrencyBalance, useTransactionAdder } from 'store'
import { tryParseAmount } from 'utils'
import { useCallWithGasPrice } from './useCallWithGasPrice'
import { useWETHContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export const useWrapCallback = (
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): {
  wrapType: WrapType
  execute?: undefined | (() => Promise<void>)
  inputError?: string
} => {
  const { t } = useTranslation()
  const { chainId, account } = useWeb3React()
  const { callWithGasPrice } = useCallWithGasPrice()
  const wbnbContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(
    () => tryParseAmount(typedValue, inputCurrency),
    [inputCurrency, typedValue]
  )
  const addTransaction = useTransactionAdder()

  return useMemo(() => {
    if (!wbnbContract || !chainId || !inputCurrency || !outputCurrency)
      return NOT_APPLICABLE

    const sufficientBalance =
      inputAmount && balance && !balance.lessThan(inputAmount)

    if (
      inputCurrency === ETHER &&
      currencyEquals(WNATIVE[chainId], outputCurrency)
    ) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await callWithGasPrice(
                    wbnbContract,
                    'deposit',
                    undefined,
                    {
                      value: `0x${inputAmount.raw.toString(16)}`,
                    }
                  )
                  addTransaction(txReceipt, {
                    summary: `Wrap ${inputAmount.toSignificant(6)} BNB to WBNB`,
                    type: 'wrap',
                  })
                } catch (error) {
                  console.error('Could not deposit', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : t('Insufficient BNB balance'),
      }
    }
    if (
      currencyEquals(WNATIVE[chainId], inputCurrency) &&
      outputCurrency === ETHER
    ) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await callWithGasPrice(
                    wbnbContract,
                    'withdraw',
                    [`0x${inputAmount.raw.toString(16)}`]
                  )
                  addTransaction(txReceipt, {
                    summary: `Unwrap ${inputAmount.toSignificant(
                      6
                    )} WBNB to BNB`,
                  })
                } catch (error) {
                  console.error('Could not withdraw', error)
                }
              }
            : undefined,
        inputError: sufficientBalance
          ? undefined
          : t('Insufficient WBNB balance'),
      }
    }
    return NOT_APPLICABLE
  }, [
    wbnbContract,
    chainId,
    inputCurrency,
    outputCurrency,
    t,
    inputAmount,
    balance,
    addTransaction,
    callWithGasPrice,
  ])
}
