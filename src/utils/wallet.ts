import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from 'packages/swap-sdk'

const NETWORK_CONFIG = {
  [ChainId.MAINNET]: {
    name: 'ETH Smart Chain Mainnet',
    // scanURL: BASE_BSC_SCAN_URLS[ChainId.BSC],
    // rpcUrls: BSC_RPC_URLS,
  },
  [ChainId.ROPSTEN]: {
    name: 'ROPSTEN Smart Chain Testnet',
    // scanURL: BASE_BSC_SCAN_URLS[ChainId.BSC_TESTNET],
    // rpcUrls: BSC_TESTNET_RPC_URLS,
  },
}

/**
 * Prompt the user to add ETH as a network on Metamask, or switch to BSC if the wallet is on a different network
 * @returns {boolean} true if the setup succeeded, false otherwise
 */
export const setupNetwork = async (
  chainId: number,
  externalProvider: ExternalProvider
) => {
  const provider = externalProvider || window.ethereum

  if (provider.request) {
    try {
      await provider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      })
      return true
    } catch (switchError) {
      if ((switchError as any)?.code === 4902) {
        try {
          await provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                chainName: NETWORK_CONFIG[chainId].name,
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'eth',
                  decimals: 18,
                },
              },
            ],
          })
        } catch (error) {
          console.error('Failed to setup the network in Metamsk ', error)
          return false
        }
      }
    }
  }
}
