import { useEffect, useMemo, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { formatEther } from 'ethers/lib/utils'
import {
  removeSelectedWallet,
  selectUser,
  updateSelectedWallet,
  useAppDispatch,
  useAppSelector,
} from 'store'
import { Web3Provider } from '@ethersproject/providers'

export const useBalance = () => {
  const { account, library } = useWeb3React()
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

  const { active, account, activate, deactivate } = useWeb3React<Web3Provider>()

  const balance = useBalance()

  const connect = () => {
    activate(new InjectedConnector({}))
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
    deactivate()
    dispatch(removeSelectedWallet())
  }

  return useMemo(() => {
    return { connect, disconnect }
  }, [])
}
