import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useWeb3React } from '@web3-react/core'
import { InjectedConnector } from '@web3-react/injected-connector'
import { formatEther } from 'ethers/lib/utils'
import {
  logOut,
  saveUser,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from 'store'
import { Web3Provider } from '@ethersproject/providers'

const useBalance = () => {
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
      dispatch(saveUser({ accountAddress: account, accountBalance: balance }))
    }
  }, [account, balance])

  useEffect(() => {
    if (!active && user.accountAddress) {
      connect()
    }
  }, [user.accountAddress])

  const disconnect = () => {
    deactivate()
    dispatch(logOut())
  }

  return { connect, disconnect }
}

interface IMetaMaskContext {
  connect: () => void
  disconnect: () => void
}

export const MetaMaskContext = createContext<IMetaMaskContext>({
  connect: () => Promise<void>,
  disconnect: () => {},
})

export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  const { connect, disconnect } = useMetamaskConnection()

  const values = useMemo(() => {
    return { connect, disconnect }
  }, [])

  return (
    <MetaMaskContext.Provider value={values}>
      {children}
    </MetaMaskContext.Provider>
  )
}

export const useMetaMask = () => {
  const context = useContext(MetaMaskContext)

  return context
}
