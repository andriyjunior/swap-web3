import {
  Currency,
  currencyEquals,
  JSBI,
  Price,
  WNATIVE,
} from 'packages/swap-sdk'
import { useActiveWeb3React } from './useActiveWeb3React'
import { USDT } from 'const'
import { useMemo } from 'react'
import { multiplyPriceByAmount } from 'utils'
import { PairState, usePairs } from './usePairs'
import { wrappedCurrency } from './wrappedCurrency'

/**
 * Returns the price in USDT of the input currency
 * @param currency currency to compute the BUSD price of
 */
export const useUSDTPrice = (currency?: Currency): Price | undefined => {
  const { chainId } = useActiveWeb3React()
  const wrapped = wrappedCurrency(currency, chainId)

  const WETH = chainId && WNATIVE[chainId]
  const usdt = chainId && USDT[chainId]

  const tokenPairs: [Currency | undefined, Currency | undefined][] = useMemo(
    () => [
      [
        chainId && wrapped && WETH && currencyEquals(WETH, wrapped)
          ? undefined
          : currency,
        chainId ? WETH : undefined,
      ],
      [wrapped?.equals(usdt) ? undefined : wrapped, usdt],
      [chainId ? WETH : undefined, usdt],
    ],
    [WETH, usdt, chainId, currency, wrapped]
  )
  const [
    [ethPairState, ethPair],
    [usdtPairState, usdtPair],
    [usdtEthPairState, usdtEthPair],
  ] = usePairs(tokenPairs)

  return useMemo(() => {
    if (!currency || !wrapped || !chainId) {
      return undefined
    }
    // handle WETH/ETH
    if (wrapped.equals(WETH)) {
      if (usdtPair) {
        const price = usdtPair.priceOf(WETH)
        return new Price(currency, usdt, price.denominator, price.numerator)
      }
      return undefined
    }
    // handle usdt
    if (wrapped.equals(usdt)) {
      return new Price(usdt, usdt, '1', '1')
    }

    const ethPairETHAmount = ethPair?.reserveOf(WETH)
    const ethPairETHUSDTValue: JSBI =
      ethPairETHAmount && usdtEthPair
        ? usdtEthPair.priceOf(WETH).quote(ethPairETHAmount).raw
        : JSBI.BigInt(0)

    // all other tokens
    // first try the usdt pair
    if (
      usdtPairState === PairState.EXISTS &&
      usdtPair &&
      usdtPair.reserveOf(usdt).greaterThan(ethPairETHUSDTValue)
    ) {
      const price = usdtPair.priceOf(wrapped)
      return new Price(currency, usdt, price.denominator, price.numerator)
    }
    if (
      ethPairState === PairState.EXISTS &&
      ethPair &&
      usdtEthPairState === PairState.EXISTS &&
      usdtEthPair
    ) {
      if (
        usdtEthPair.reserveOf(usdt).greaterThan('0') &&
        ethPair.reserveOf(WETH).greaterThan('0')
      ) {
        const ethUsdtPrice = usdtEthPair.priceOf(usdt)
        const currencyEthPrice = ethPair.priceOf(WETH)
        const usdtPrice = ethUsdtPrice.multiply(currencyEthPrice).invert()
        return new Price(
          currency,
          usdt,
          usdtPrice.denominator,
          usdtPrice.numerator
        )
      }
    }

    return undefined
  }, [
    currency,
    wrapped,
    chainId,
    WETH,
    usdt,
    ethPair,
    usdtEthPair,
    usdtPairState,
    usdtPair,
    ethPairState,
    usdtEthPairState,
  ])
}

// export const useCakeBusdPrice = (): Price | undefined => {
//   const { chainId } = useActiveWeb3React()
//   const cakeBusdPrice = useBUSDPrice(CAKE[chainId])
//   return cakeBusdPrice
// }

export const useUSDTCurrencyAmount = (
  currency?: Currency,
  amount?: number
): number | undefined => {
  const usdtPrice = useUSDTPrice(currency)

  if (!amount) {
    return undefined
  }
  if (usdtPrice) {
    return multiplyPriceByAmount(usdtPrice, amount)
  }
  return undefined
}

// export const useBUSDCakeAmount = (amount: number): number | undefined => {
//   const cakeBusdPrice = useCakeBusdPrice()
//   if (cakeBusdPrice) {
//     return multiplyPriceByAmount(cakeBusdPrice, amount)
//   }
//   return undefined
// }

// export const useBNBBusdPrice = (): Price | undefined => {
//   const { chainId } = useActiveWeb3React()
//   const bnbBusdPrice = useBUSDPrice(WNATIVE[chainId])
//   return bnbBusdPrice
// }
