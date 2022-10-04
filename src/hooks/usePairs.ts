import { Currency, Pair, TokenAmount } from 'packages/swap-sdk'
import { useWeb3React } from '@web3-react/core'
import { useMemo } from 'react'
import { useMultipleContractSingleData } from 'store'
import { wrappedCurrency } from './wrappedCurrency'
import IPair from 'abis/SevnPair.json'
import { Interface } from '@ethersproject/abi'

const PAIR_INTERFACE = new Interface(IPair.abi)

export enum PairState {
  LOADING,
  NOT_EXISTS,
  EXISTS,
  INVALID,
}

export function usePairs(
  currencies: [Currency | undefined, Currency | undefined][]
): [PairState, Pair | null][] {
  const { chainId } = useWeb3React()

  const tokens = useMemo(
    () =>
      currencies.map(([currencyA, currencyB]) => [
        wrappedCurrency(currencyA, chainId),
        wrappedCurrency(currencyB, chainId),
      ]),
    [chainId, currencies]
  )

  const pairAddresses = useMemo(
    () =>
      tokens.map(([tokenA, tokenB]) => {
        try {
          return tokenA && tokenB && !tokenA.equals(tokenB)
            ? Pair.getAddress(tokenA, tokenB)
            : undefined
        } catch (error: any) {
          // Debug Invariant failed related to this line
          console.error(
            error,
            `- pairAddresses: ${tokenA?.address}-${tokenB?.address}`,
            `chainId: ${tokenA?.chainId}`
          )

          return undefined
        }
      }),
    [tokens]
  )

  const results = useMultipleContractSingleData(
    pairAddresses,
    PAIR_INTERFACE,
    'getReserves'
  )

  return useMemo(() => {
    return results.map((result, i) => {
      const { result: reserves, loading } = result
      const tokenA = tokens[i][0]
      const tokenB = tokens[i][1]

      if (loading) return [PairState.LOADING, null]

      if (!tokenA || !tokenB || tokenA.equals(tokenB))
        return [PairState.INVALID, null]
      if (!reserves) return [PairState.NOT_EXISTS, null]
      const [reserve0, reserve1] = reserves
      const [token0, token1] = tokenA.sortsBefore(tokenB)
        ? [tokenA, tokenB]
        : [tokenB, tokenA]
      // return [PairState.LOADING, null]
      return [
        PairState.EXISTS,
        new Pair(
          new TokenAmount(token0, reserve0?.toString()),
          new TokenAmount(token1, reserve1?.toString())
        ),
      ]
    })
  }, [results, tokens])
}

export function usePair(
  tokenA?: Currency,
  tokenB?: Currency
): [PairState, Pair | null] {
  const pairCurrencies = useMemo<
    [Currency | undefined, Currency | undefined][]
  >(() => [[tokenA, tokenB]], [tokenA, tokenB])
  return usePairs(pairCurrencies)[0]
}