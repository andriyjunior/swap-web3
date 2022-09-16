import { Currency, ETHER, Token, WETH9, WNATIVE } from 'packages/swap-sdk'
import { useWeb3React } from '@web3-react/core'
import { SerializedToken } from 'abis'

import allTokens_mock from 'const/token-list.json'
import { arrayify, parseBytes32String } from 'ethers/lib/utils'
import { useMemo } from 'react'
import { NEVER_RELOAD, useSingleCallResult, WrappedTokenInfo } from 'store'
import { isAddress } from 'utils'
import { useBytes32TokenContract, useTokenContract } from './useContract'

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

export const useAllTokens = (): { [address: string]: Token } => {
  const { chainId } = useWeb3React()
  const wrappedTokens = allTokens_mock.tokens.map(deserializeToken)

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
  const { chainId } = useWeb3React()
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
  const isETH = currencyId?.toUpperCase() === 'ETH'
  // currencyId?.toLowerCase() === GELATO_NATIVE
  const token = useToken(isETH ? undefined : currencyId)
  return isETH ? ETHER : token
}
