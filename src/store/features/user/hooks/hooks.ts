import { ChainId, Pair, Token } from 'packages/swap-sdk'
import { GAS_PRICE_GWEI } from 'const'
import { selectGasPrice } from 'store/selectors'
import { useAppDispatch, useAppSelector } from 'store/utils'
import {
  deserializeToken,
  useActiveWeb3React,
  useOfficialsAndUserAddedTokens,
} from 'hooks'
import { useCallback, useMemo } from 'react'
import { BASES_TO_TRACK_LIQUIDITY_FOR, PINNED_PAIRS } from 'config'
import farms from 'config/constants/farms'
import { flatMap } from 'lodash'
import { useSelector } from 'react-redux'
import { RootState } from 'store/store'
import {
  addSerializedToken,
  removeSerializedToken,
  updateUserSingleHopOnly,
} from '../reducer'
import { serializeToken } from './helpers'

export const useGasPrice = (): string => {
  const { chainId } = useActiveWeb3React()

  const userGas = useAppSelector(selectGasPrice)
  return chainId === ChainId.MAINNET ? userGas : GAS_PRICE_GWEI.testnet
}

/**
 * Returns all the pairs of tokens that are tracked by the user for the current chain ID.
 */
export function useTrackedTokenPairs(): [Token, Token][] {
  const { chainId } = useActiveWeb3React()
  const tokens = useOfficialsAndUserAddedTokens()

  // pinned pairs
  const pinnedPairs = useMemo(
    () => (chainId ? PINNED_PAIRS[chainId] ?? [] : []),
    [chainId]
  )

  const farmPairs: [Token, Token][] = []

  // const farmPairs: [Token, Token][] = useMemo(
  //   () =>
  //     farms
  //       .filter((farm) => farm.pid !== 0)
  //       .map((farm) => [
  //         deserializeToken(farm.token),
  //         deserializeToken(farm.quoteToken),
  //       ]),
  //   []
  // )

  // pairs for every token against every base
  const generatedPairs: [Token, Token][] = useMemo(
    () =>
      chainId
        ? flatMap(Object.keys(tokens), (tokenAddress) => {
            const token = tokens[tokenAddress]
            // for each token on the current chain,
            return (
              // loop through all bases on the current chain
              (BASES_TO_TRACK_LIQUIDITY_FOR[chainId] ?? [])
                // to construct pairs of the given token with each base
                .map((base) => {
                  if (base.address === token.address) {
                    return null
                  }
                  return [base, token]
                })
                .filter((p): p is [Token, Token] => p !== null)
            )
          })
        : [],
    [tokens, chainId]
  )

  // pairs saved by users
  const savedSerializedPairs = useSelector<
    RootState,
    RootState['user']['pairs']
  >(({ user: { pairs } }) => pairs)

  const userPairs: [Token, Token][] = useMemo(() => {
    if (!chainId || !savedSerializedPairs) return []
    const forChain = savedSerializedPairs[chainId]
    if (!forChain) return []

    return Object.keys(forChain).map((pairId) => {
      return [
        deserializeToken(forChain[pairId].token0),
        deserializeToken(forChain[pairId].token1),
      ]
    })
  }, [savedSerializedPairs, chainId])

  const combinedList = useMemo(
    () =>
      userPairs.concat(generatedPairs).concat(pinnedPairs).concat(farmPairs),
    [generatedPairs, pinnedPairs, userPairs, farmPairs]
  )

  return useMemo(() => {
    // dedupes pairs of tokens in the combined list
    const keyed = combinedList.reduce<{ [key: string]: [Token, Token] }>(
      (memo, [tokenA, tokenB]) => {
        const sorted = tokenA.sortsBefore(tokenB)
        const key = sorted
          ? `${tokenA.address}:${tokenB.address}`
          : `${tokenB.address}:${tokenA.address}`
        if (memo[key]) return memo
        memo[key] = sorted ? [tokenA, tokenB] : [tokenB, tokenA]
        return memo
      },
      {}
    )

    return Object.keys(keyed).map((key) => keyed[key])
  }, [combinedList])
}

/**
 * Given two tokens return the liquidity token that represents its liquidity shares
 * @param tokenA one of the two tokens
 * @param tokenB the other token
 */
export function toV2LiquidityToken([tokenA, tokenB]: [Token, Token]): Token {
  return new Token(
    tokenA.chainId,
    Pair.getAddress(tokenA, tokenB),
    18,
    'Sevn-LP',
    'SevnFinance LPs'
  )
}

export const useAddUserToken = (): ((token: Token) => void) => {
  const dispatch = useAppDispatch()
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }))
    },
    [dispatch]
  )
}

export const useRemoveUserAddedToken = (): ((
  chainId: number,
  address: string
) => void) => {
  const dispatch = useAppDispatch()
  return useCallback(
    (chainId: number, address: string) => {
      dispatch(removeSerializedToken({ chainId, address }))
    },
    [dispatch]
  )
}

export const useUserSingleHopOnly = (): [
  boolean,
  (newSingleHopOnly: boolean) => void
] => {
  const dispatch = useAppDispatch()

  const singleHopOnly = useSelector<
    RootState,
    RootState['user']['userSingleHopOnly']
  >((state) => state.user.userSingleHopOnly)

  const setSingleHopOnly = useCallback(
    (newSingleHopOnly: boolean) => {
      dispatch(updateUserSingleHopOnly({ userSingleHopOnly: newSingleHopOnly }))
    },
    [dispatch]
  )

  return [singleHopOnly, setSingleHopOnly]
}
