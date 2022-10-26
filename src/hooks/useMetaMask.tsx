import { useEffect, useMemo, useState } from 'react'
import { formatEther } from 'ethers/lib/utils'
import {
  selectUser,
  updateSelectedWallet,
  useAppDispatch,
  useAppSelector,
} from 'store'
import { useAuth } from './useAuth'
import { ConnectorNames, connectorsByName } from 'utils'
import { useActiveWeb3React } from './useActiveWeb3React'

export const useBalance = () => {
  const { account, library } = useActiveWeb3React()
  const [balance, setBalance] = useState('')

  useEffect(() => {
    if (account) {
      library?.getBalance(account).then((res) => setBalance(formatEther(res)))
    }
  }, [account, library])

  return balance
}

export const useMetamaskConnection = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const { active, account, logOut, login } = useAuth()

  const balance = useBalance()

  const connect = () => {
    login(ConnectorNames.Injected)
  }

  useEffect(() => {
    if (account) {
      dispatch(updateSelectedWallet(account))
    }
  }, [account])

  useEffect(() => {
    if (!active && user.selectedWallet) {
      connect()
    }
  }, [user.selectedWallet])

  const disconnect = () => {
    logOut()
  }

  return useMemo(() => {
    return { connect, disconnect }
  }, [])
}
