import { createSelector } from '@reduxjs/toolkit'
import { useActiveWeb3React } from 'hooks'
import { Token } from 'packages/swap-sdk'

import { useSelector } from 'react-redux'
import { RootState } from 'store/store'

import { deserializeToken } from './helpers'

const selectUserTokens = ({ user: { tokens } }: RootState) => tokens

export const userAddedTokenSelector = (chainId: number) =>
  createSelector(selectUserTokens, (serializedTokensMap) =>
    Object.values(serializedTokensMap?.[chainId] ?? {}).map(deserializeToken)
  )

export default function useUserAddedTokens(): Token[] {
  const { chainId } = useActiveWeb3React()
  return useSelector(userAddedTokenSelector(chainId!))
}
