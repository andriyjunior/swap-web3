import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { NETWORK_CONFIG } from 'utils'
import Web3 from 'web3'
import { useToast } from './useToast'

export const useSwitchNetwork = () => {
  //   const [loading, setLoading] = useSwitchNetworkLoading()
  //   const {
  //     switchNetworkAsync: _switchNetworkAsync,
  //     isLoading: _isLoading,
  //     switchNetwork: _switchNetwork,
  //     ...switchNetworkArgs
  //   } = useSwitchNetworkWallet()
  const { t } = useTranslation()
  const { toastError } = useToast()
  //   const { isConnected, connector } = useAccount()

  //   const switchNetworkLocal = useSwitchNetworkLocal()

  const switchNetworkAsync = useCallback(
    async (chainId: number) => {
      if (!window.ethereum) return

      const provider = window.ethereum

      try {
        await provider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(chainId) }],
        })
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask
        if ((switchError as any)?.code === 4902) {
          try {
            await provider.request({
              method: 'wallet_switchEthereumChain',
              params: [
                {
                  chainId: `0x${chainId.toString(16)}`,
                },
              ],
            })
          } catch (error) {
            console.error('Failed to setup the network in Metamask ', error)
            return false
          }
        }
      }
    },

    []
  )

  return {
    // ...switchNetworkArgs,
    // switchNetwork,
    switchNetworkAsync,
    // isLoading,
    // canSwitch,
  }
}
