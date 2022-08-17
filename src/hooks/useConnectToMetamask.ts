import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

const ETH_REQUESTACCOUNTS = 'eth_requestAccounts'

export const useConnectToMetamask = () => {
  const [accountAddress, setAccountAddress] = useState('')
  const [accountBalance, setAccountBalance] = useState('')

  // eslint-disable-next-line
  const [isConnected, setIsConnected] = useState(false)
  // eslint-disable-next-line
  const [haveMetamask, setHaveMetamask] = useState(false)

  const { ethereum } = window

  const provider = ethereum && new ethers.providers.Web3Provider(ethereum)

  useEffect(() => {
    const connectWallet = async () => {
      try {
        if (!ethereum) {
          setHaveMetamask(false)
        }

        const accounts =
          ethereum?.request &&
          (await ethereum?.request({ method: ETH_REQUESTACCOUNTS }))

        const balance = await provider?.getBalance(accounts[0])
        const bal = ethers.utils.formatEther(balance ?? '')
        setAccountAddress(accounts[0])
        setAccountBalance(bal)
        setIsConnected(true)
      } catch (error) {
        setIsConnected(false)
      }
    }

    connectWallet()
  }, [])

  return { accountAddress, accountBalance }
}
