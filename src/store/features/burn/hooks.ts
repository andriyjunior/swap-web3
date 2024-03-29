import {
  useActiveWeb3React,
  usePair,
  useTotalSupply,
  wrappedCurrency,
} from 'hooks'
import {
  Currency,
  CurrencyAmount,
  JSBI,
  Pair,
  Percent,
  TokenAmount,
} from 'packages/swap-sdk'
import { useCallback } from 'react'
import { selectBurnState } from 'store/selectors'
import { RootState } from 'store/store'
import { useAppDispatch, useAppSelector } from 'store/utils'
import { tryParseAmount } from 'utils'
import { useTokenBalances } from '../wallet/hooks'
import { burnTypeInput, Field } from './reducer'

export const useBurnState = (): RootState['burn'] => {
  return useAppSelector(selectBurnState)
}

export const useDerivedBurnInfo = (
  currencyA: Currency | undefined,
  currencyB: Currency | undefined,
  removalCheckedA?: boolean,
  removalCheckedB?: boolean
): {
  pair?: Pair | null
  parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: CurrencyAmount
    [Field.CURRENCY_B]?: CurrencyAmount
  }
  error?: string
  tokenToReceive?: string
} => {
  const { account, chainId } = useActiveWeb3React()

  const { independentField, typedValue } = useBurnState()

  // pair + totalsupply
  const [, pair] = usePair(currencyA, currencyB)

  // balances
  const relevantTokenBalances = useTokenBalances(account ?? undefined, [
    pair?.liquidityToken,
  ])
  const userLiquidity: undefined | TokenAmount =
    relevantTokenBalances?.[pair?.liquidityToken?.address ?? '']

  const [tokenA, tokenB] = [
    wrappedCurrency(currencyA, chainId),
    wrappedCurrency(currencyB, chainId),
  ]

  const tokens = {
    [Field.CURRENCY_A]: tokenA,
    [Field.CURRENCY_B]: tokenB,
    [Field.LIQUIDITY]: pair?.liquidityToken,
  }

  // liquidity values
  const totalSupply = useTotalSupply(pair?.liquidityToken)
  const liquidityValueA =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenA &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(
          tokenA,
          pair.getLiquidityValue(tokenA, totalSupply, userLiquidity, false).raw
        )
      : undefined

  const liquidityValueB =
    pair &&
    totalSupply &&
    userLiquidity &&
    tokenB &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalSupply.raw, userLiquidity.raw)
      ? new TokenAmount(
          tokenB,
          pair.getLiquidityValue(tokenB, totalSupply, userLiquidity, false).raw
        )
      : undefined

  const liquidityValues: {
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.CURRENCY_A]: liquidityValueA,
    [Field.CURRENCY_B]: liquidityValueB,
  }

  let percentToRemove: Percent = new Percent('0', '100')
  // user specified a %
  if (independentField === Field.LIQUIDITY_PERCENT) {
    percentToRemove = new Percent(typedValue, '100')
  }

  // user specified a specific amount of liquidity tokens
  else if (independentField === Field.LIQUIDITY) {
    if (pair?.liquidityToken) {
      const independentAmount = tryParseAmount(typedValue, pair.liquidityToken)
      if (
        independentAmount &&
        userLiquidity &&
        !independentAmount.greaterThan(userLiquidity)
      ) {
        percentToRemove = new Percent(independentAmount.raw, userLiquidity.raw)
      }
    }
  }

  // user specified a specific amount of token a or b
  else if (tokens[independentField]) {
    const independentAmount = tryParseAmount(
      typedValue,
      tokens[independentField]
    )
    const liquidityValue = liquidityValues[independentField]
    if (
      independentAmount &&
      liquidityValue &&
      !independentAmount.greaterThan(liquidityValue)
    ) {
      percentToRemove = new Percent(independentAmount.raw, liquidityValue.raw)
    }
  }

  const liquidityToRemove =
    userLiquidity && percentToRemove && percentToRemove.greaterThan('0')
      ? new TokenAmount(
          userLiquidity.token,
          percentToRemove.multiply(userLiquidity.raw).quotient
        )
      : undefined

  const tokenToReceive =
    removalCheckedA && removalCheckedB
      ? undefined
      : removalCheckedA
      ? tokens[Field.CURRENCY_A]?.address
      : tokens[Field.CURRENCY_B]?.address

  const amountA =
    tokenA &&
    percentToRemove &&
    percentToRemove.greaterThan('0') &&
    liquidityValueA
      ? new TokenAmount(
          tokenA,
          percentToRemove.multiply(liquidityValueA.raw).quotient
        )
      : undefined

  const amountB =
    tokenB &&
    percentToRemove &&
    percentToRemove.greaterThan('0') &&
    liquidityValueB
      ? new TokenAmount(
          tokenB,
          percentToRemove.multiply(liquidityValueB.raw).quotient
        )
      : undefined

  const parsedAmounts: {
    [Field.LIQUIDITY_PERCENT]: Percent
    [Field.LIQUIDITY]?: TokenAmount
    [Field.CURRENCY_A]?: TokenAmount
    [Field.CURRENCY_B]?: TokenAmount
  } = {
    [Field.LIQUIDITY_PERCENT]: percentToRemove,
    [Field.LIQUIDITY]: liquidityToRemove,
    [Field.CURRENCY_A]: amountA,
    [Field.CURRENCY_B]: amountB,
  }

  let error: string | undefined

  if (!account) {
    error = 'Connect Wallet'
  }

  if (
    !parsedAmounts[Field.LIQUIDITY] ||
    (removalCheckedA && !parsedAmounts[Field.CURRENCY_A]) ||
    (removalCheckedB && !parsedAmounts[Field.CURRENCY_B])
  ) {
    error = error ?? 'Enter an amount'
  }

  return { pair, parsedAmounts, error, tokenToReceive }
}

export const useBurnActionHandlers = (): {
  onUserInput: (field: Field, typedValue: string) => void
} => {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (field: Field, typedValue: string) => {
      dispatch(burnTypeInput({ field, typedValue }))
    },
    [dispatch]
  )

  return {
    onUserInput,
  }
}
