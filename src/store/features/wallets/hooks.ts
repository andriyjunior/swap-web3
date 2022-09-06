import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from 'store/utils'
import { addConnectedWallet } from './reducer'
import { Wallet } from './types'

// export const useConnectedWallets = (): [Wallet[], (wallet: Wallet) => void] => {
//   const dispatch = useAppDispatch()
//   const connectedWallets = useAppSelector(
//     (state) => state.wallets.connectedWallets
//   )
//   const addWallet = useCallback(
//     (wallet: Wallet) => {
//       dispatch(addConnectedWallet(wallet))
//     },
//     [dispatch]
//   )
//   return [connectedWallets, addWallet]
// }

export {}
