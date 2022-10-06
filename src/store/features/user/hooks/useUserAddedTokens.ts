import { createSelector } from '@reduxjs/toolkit'
import { Token } from 'packages/swap-sdk'
import { useWeb3React } from '@web3-react/core'

import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

import { deserializeToken } from './helpers'

const selectUserTokens = ({ user: { tokens } }: RootState) => tokens

export const userAddedTokenSelector = (chainId: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
  )

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useWeb3React()
  return useSelector(userAddedTokenSelector(chainId || 1))
}
