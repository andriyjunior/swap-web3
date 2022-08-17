import { ethers } from 'ethers'
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  logOut,
  saveUser,
  selectUser,
  useAppDispatch,
  useAppSelector,
} from 'store'

const ETH_REQUESTACCOUNTS = 'eth_requestAccounts'

const initialState = {
  accountAddress: '',
  accountBalance: '',
}

export const useMetamaskConnection = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)

  const [accountInfo, setAccountInfo] = useState(initialState)

  const [isConnected, setIsConnected] = useState(false)

  const { ethereum } = window

  const provider = ethereum && new ethers.providers.Web3Provider(ethereum)

  const connect = async () => {
    try {
      if (!ethereum) {
        return console.log('You need to install MetaMask')
      }

      const accounts =
        ethereum?.request &&
        (await ethereum?.request({ method: ETH_REQUESTACCOUNTS }))

      const balance = await provider?.getBalance(accounts[0])
      const bal = ethers.utils.formatEther(balance ?? '')

      setAccountInfo({ accountAddress: accounts[0], accountBalance: bal })
      setIsConnected(true)
    } catch (error) {
      setIsConnected(false)
    }
  }

  useEffect(() => {
    if (accountInfo.accountAddress) {
      dispatch(saveUser(accountInfo))
    }
  }, [accountInfo.accountAddress])

  useEffect(() => {
    if (!isConnected && user.accountAddress) {
      connect()
    }
  }, [user.accountAddress])

  const disconnect = () => {
    setAccountInfo(initialState)
    setIsConnected(false)
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
