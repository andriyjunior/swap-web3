import {
  Currency,
  CurrencyAmount,
  ETHER,
  JSBI,
  Pair,
  Percent,
  Price,
  TokenAmount,
} from 'packages/swap-sdk'
import { useWeb3React } from '@web3-react/core'
import { BIG_INT_ZERO } from 'config'
import {
  PairState,
  usePair,
  useTotalSupply,
  wrappedCurrency,
  wrappedCurrencyAmount,
} from 'hooks'
import { useCallback, useMemo } from 'react'
import {
  mintTypeInput,
  useCurrencyBalances,
  useAppSelector,
  useAppDispatch,
} from 'store'
import { selectMintState } from 'store/selectors'
import { tryParseAmount } from 'utils'
import { Field } from 'types'

export const useMintState = () => {
  return useAppSelector(selectMintState)
}

export const useDerivedMintInfo = (
  currencyA: Currency | undefined,
  currencyB: Currency | undefined
): {
  dependentField: Field
  currencies: { [field in Field]?: Currency }
  pair?: Pair | null
  pairState: PairState
  currencyBalances: { [field in Field]?: CurrencyAmount }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  price?: Price
  noLiquidity?: boolean
  liquidityMinted?: TokenAmount
  poolTokenPercentage?: Percent
  error?: string
  addError?: string
} => {
  const { account, chainId } = useWeb3React()

  const { independentField, typedValue, otherTypedValue } = useMintState()

  const dependentField =
    independentField === Field.CURRENCY_A ? Field.CURRENCY_B : Field.CURRENCY_A

  // tokens
  const currencies: { [field in Field]?: Currency } = useMemo(
    () => ({
      [Field.CURRENCY_A]: currencyA ?? undefined,
      [Field.CURRENCY_B]: currencyB ?? undefined,
    }),
    [currencyA, currencyB]
  )

  // pair
  const [pairState, pair] = usePair(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B]
  )

  const totalSupply = useTotalSupply(pair?.liquidityToken)

  const noLiquidity: boolean =
    pairState === PairState.NOT_EXISTS ||
    Boolean(totalSupply && JSBI.equal(totalSupply.raw, BIG_INT_ZERO))

  const balances = useCurrencyBalances(account ?? undefined, [
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B],
  ])
  const currencyBalances: { [field in Field]?: CurrencyAmount } = {
    [Field.CURRENCY_A]: balances[0],
    [Field.CURRENCY_B]: balances[1],
  }

  // amounts
  const independentAmount: CurrencyAmount | undefined = tryParseAmount(
    typedValue,
    currencies[independentField]
  )

  const dependentAmount: CurrencyAmount | undefined = useMemo(() => {
    if (noLiquidity) {
      if (otherTypedValue && currencies[dependentField]) {
        return tryParseAmount(otherTypedValue, currencies[dependentField])
      }
      return undefined
    }
    if (independentAmount) {
      // we wrap the currencies just to get the price in terms of the other token
      const wrappedIndependentAmount = wrappedCurrencyAmount(
        independentAmount,
        chainId
      )
      const [tokenA, tokenB] = [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]
      if (tokenA && tokenB && wrappedIndependentAmount && pair) {
        const dependentCurrency =
          dependentField === Field.CURRENCY_B ? currencyB : currencyA
        const dependentTokenAmount =
          dependentField === Field.CURRENCY_B
            ? pair.priceOf(tokenA).quote(wrappedIndependentAmount)
            : pair.priceOf(tokenB).quote(wrappedIndependentAmount)
        return dependentCurrency === ETHER
          ? CurrencyAmount.ether(dependentTokenAmount.raw)
          : dependentTokenAmount
      }
      return undefined
    }
    return undefined
  }, [
    noLiquidity,
    otherTypedValue,
    currencies,
    dependentField,
    independentAmount,
    currencyA,
    chainId,
    currencyB,
    pair,
  ])

  const parsedAmounts: { [field in Field]: CurrencyAmount | undefined } =
    useMemo(
      () => ({
        [Field.CURRENCY_A]:
          independentField === Field.CURRENCY_A
            ? independentAmount
            : dependentAmount,
        [Field.CURRENCY_B]:
          independentField === Field.CURRENCY_A
            ? dependentAmount
            : independentAmount,
      }),
      [dependentAmount, independentAmount, independentField]
    )

  const price = useMemo(() => {
    if (noLiquidity) {
      const {
        [Field.CURRENCY_A]: currencyAAmount,
        [Field.CURRENCY_B]: currencyBAmount,
      } = parsedAmounts
      if (currencyAAmount && currencyBAmount) {
        return new Price(
          currencyAAmount.currency,
          currencyBAmount.currency,
          currencyAAmount.raw,
          currencyBAmount.raw
        )
      }
      return undefined
    }
    const wrappedCurrencyA = wrappedCurrency(currencyA, chainId)
    return pair && wrappedCurrencyA ? pair.priceOf(wrappedCurrencyA) : undefined
  }, [chainId, currencyA, noLiquidity, pair, parsedAmounts])

  // liquidity minted
  const liquidityMinted = useMemo(() => {
    const {
      [Field.CURRENCY_A]: currencyAAmount,
      [Field.CURRENCY_B]: currencyBAmount,
    } = parsedAmounts
    const [tokenAmountA, tokenAmountB] = [
      wrappedCurrencyAmount(currencyAAmount, chainId),
      wrappedCurrencyAmount(currencyBAmount, chainId),
    ]
    if (pair && totalSupply && tokenAmountA && tokenAmountB) {
      try {
        return pair.getLiquidityMinted(totalSupply, tokenAmountA, tokenAmountB)
      } catch (error) {
        console.error(error)
        return undefined
      }
    }
    return undefined
  }, [parsedAmounts, chainId, pair, totalSupply])

  const poolTokenPercentage = useMemo(() => {
    if (liquidityMinted && totalSupply) {
      return new Percent(
        liquidityMinted.raw,
        totalSupply.add(liquidityMinted).raw
      )
    }
    return undefined
  }, [liquidityMinted, totalSupply])

  let error: string | undefined
  let addError: string | undefined
  //   if (!account) {
  //     error = t('Connect Wallet')
  //   }

  //   if (pairState === PairState.INVALID) {
  //     error = error ?? t('Choose a valid pair')
  //   }

  const {
    [Field.CURRENCY_A]: currencyAAmount,
    [Field.CURRENCY_B]: currencyBAmount,
  } = parsedAmounts

  //   if (
  //     currencyAAmount &&
  //     currencyBAmount &&
  //     currencyBalances?.[Field.CURRENCY_A]?.equalTo(0) &&
  //     currencyBalances?.[Field.CURRENCY_B]?.equalTo(0)
  //   ) {
  //     error = error ?? t('No token balance')
  //   }

  //   if (!parsedAmounts[Field.CURRENCY_A] || !parsedAmounts[Field.CURRENCY_B]) {
  //     addError = t('Enter an amount')
  //   }

  //   if (currencyAAmount && currencyBalances?.[Field.CURRENCY_A]?.lessThan(currencyAAmount)) {
  //     addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_A]?.symbol })
  //   }

  //   if (currencyBAmount && currencyBalances?.[Field.CURRENCY_B]?.lessThan(currencyBAmount)) {
  //     addError = t('Insufficient %symbol% balance', { symbol: currencies[Field.CURRENCY_B]?.symbol })
  //   }

  return {
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
  }
}

export function useMintActionHandlers(noLiquidity: boolean | undefined): {
  onFieldAInput: (typedValue: string) => void
  onFieldBInput: (typedValue: string) => void
} {
  const dispatch = useAppDispatch()

  const onFieldAInput = useCallback(
    (typedValue: string) => {
      dispatch(
        mintTypeInput({
          field: Field.CURRENCY_A,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      )
    },
    [dispatch, noLiquidity]
  )
  const onFieldBInput = useCallback(
    (typedValue: string) => {
      dispatch(
        mintTypeInput({
          field: Field.CURRENCY_B,
          typedValue,
          noLiquidity: noLiquidity === true,
        })
      )
    },
    [dispatch, noLiquidity]
  )

  return {
    onFieldAInput,
    onFieldBInput,
  }
}
