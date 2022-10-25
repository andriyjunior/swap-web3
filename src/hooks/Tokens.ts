import { Currency, ETHER, Token, WETH9, WNATIVE } from 'packages/swap-sdk'
import { SerializedToken } from 'abis'

import allTokens_mock from 'const/token-list.json'
import { arrayify, parseBytes32String } from 'ethers/lib/utils'
import { useMemo } from 'react'
import {
  combinedTokenMapFromOfficialsUrlsSelector,
  NEVER_RELOAD,
  TokenAddressMap,
  userAddedTokenSelector,
  useSingleCallResult,
  WrappedTokenInfo,
} from 'store'
import { isAddress } from 'utils'
import { useBytes32TokenContract, useTokenContract } from './useContract'
import { createSelector } from '@reduxjs/toolkit'
import { useSelector } from 'react-redux'
import useUserAddedTokens from 'store/features/user/hooks/useUserAddedTokens'
import { useActiveWeb3React } from 'hooks'

export function deserializeToken(serializedToken: SerializedToken): Token {
  if (serializedToken.logoURI) {
    return new WrappedTokenInfo(
      {
        chainId: serializedToken.chainId,
        address: serializedToken.address,
        decimals: serializedToken.decimals,
        symbol: serializedToken.symbol ?? '',
        name: serializedToken.name ?? '',
        logoURI: serializedToken.logoURI,
      },
      []
    )
  }
  return new Token(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
    // serializedToken.projectLink ,
  )
}

const mapWithoutUrls = (tokenMap: TokenAddressMap, chainId: number) =>
  Object.keys(tokenMap[chainId]).reduce<{ [address: string]: Token }>(
    (newMap, address) => {
      newMap[address] = tokenMap[chainId][address].token
      return newMap
    },
    {}
  )

export const useAllTokens = (): { [address: string]: Token } => {
  const { chainId } = useActiveWeb3React()
  const userTokens = useUserAddedTokens().map(deserializeToken)

  const wrappedTokens = [...allTokens_mock.tokens, ...userTokens].map(
    deserializeToken
  )

  if (chainId) {
    wrappedTokens.unshift(WNATIVE[chainId])
  }

  return wrappedTokens.reduce((tokenMap_, token) => {
    tokenMap_[token.address] = token
    return tokenMap_
  }, {})
}

// parse a name or symbol from a token response
const BYTES32_REGEX = /^0x[a-fA-F0-9]{64}$/

function parseStringOrBytes32(
  str: string | undefined,
  bytes32: string | undefined,
  defaultValue: string
): string {
  return str && str.length > 0
    ? str
    : // need to check for proper bytes string and valid terminator
    bytes32 && BYTES32_REGEX.test(bytes32) && arrayify(bytes32)[31] === 0
    ? parseBytes32String(bytes32)
    : defaultValue
}

export function useToken(tokenAddress?: string): Token | undefined | null {
  const { chainId } = useActiveWeb3React()
  const tokens = useAllTokens()

  const address = isAddress(tokenAddress)

  const tokenContract = useTokenContract(address || undefined, false)
  const tokenContractBytes32 = useBytes32TokenContract(
    address || undefined,
    false
  )
  const token: Token | undefined = address ? tokens[address] : undefined

  const tokenName = useSingleCallResult(
    token ? undefined : tokenContract,
    'name',
    undefined,
    NEVER_RELOAD
  )

  const tokenNameBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'name',
    undefined,
    NEVER_RELOAD
  )

  const symbol = useSingleCallResult(
    token ? undefined : tokenContract,
    'symbol',
    undefined,
    NEVER_RELOAD
  )

  const symbolBytes32 = useSingleCallResult(
    token ? undefined : tokenContractBytes32,
    'symbol',
    undefined,
    NEVER_RELOAD
  )
  const decimals = useSingleCallResult(
    token ? undefined : tokenContract,
    'decimals',
    undefined,
    NEVER_RELOAD
  )

  // return token
  return useMemo(() => {
    if (token) return token
    if (!chainId || !address) return undefined
    if (decimals.loading || symbol.loading || tokenName.loading) return null
    if (decimals.result) {
      const newToken = new Token(
        chainId,
        address,
        decimals.result[0],
        parseStringOrBytes32(
          symbol.result?.[0],
          symbolBytes32.result?.[0],
          'UNKNOWN'
        ),
        parseStringOrBytes32(
          tokenName.result?.[0],
          tokenNameBytes32.result?.[0],
          'Unknown Token'
        )
      )

      return newToken
    }
    return undefined
  }, [
    address,
    chainId,
    decimals.loading,
    decimals.result,
    symbol.loading,
    symbol.result,
    symbolBytes32.result,
    token,
    tokenName.loading,
    tokenName.result,
    tokenNameBytes32.result,
  ])
}

export const useCurrency = (
  currencyId: string | undefined
): Currency | Token | null | undefined => {
  const isETH = currencyId?.toUpperCase().includes('ETH')
  // currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}

const allOfficialsAndUserAddedTokensSelector = (chainId: number) =>
  createSelector(
    [
      combinedTokenMapFromOfficialsUrlsSelector,
      userAddedTokenSelector(chainId),
    ],
    (tokenMap, userAddedTokens) => {
      return (
        userAddedTokens
          // reduce into all ALL_TOKENS filtered by the current chain
          .reduce<{ [address: string]: Token }>(
            (tokenMap_, token) => {
              tokenMap_[token.address] = token
              return tokenMap_
            },
            // must make a copy because reduce modifies the map, and we do not
            // want to make a copy in every iteration
            mapWithoutUrls(tokenMap, chainId)
          )
      )
    }
  )

/**
 * Returns all tokens that are from officials token list and user added tokens
 */
export function useOfficialsAndUserAddedTokens(): { [address: string]: Token } {
  const { chainId } = useActiveWeb3React()
  return useSelector(allOfficialsAndUserAddedTokensSelector(chainId || 1))
}
