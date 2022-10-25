import { ExternalProvider } from '@ethersproject/providers'
import { ChainId } from 'packages/swap-sdk'
import { BAD_SRCS } from './getTokenUrlByAddress'

const NETWORK_CONFIG = {
  [ChainId.MAINNET]: {
    name: 'ETH Smart Chain Mainnet',
    // scanURL: BASE_BSC_SCAN_URLS[ChainId.BSC],
    // rpcUrls: BSC_RPC_URLS,
  },
  [ChainId.TESTNET]: {
    name: 'TESTNET Smart Chain Testnet',
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
          console.error('Failed to setup the network in Metamask ', error)
          return false
        }
      }
    }
  }
}

/**
 * Prompt the user to add a custom token to metamask
 * @param tokenAddress
 * @param tokenSymbol
 * @param tokenDecimals
 * @returns {boolean} true if the token has been added, false otherwise
 */
export const registerToken = async (
  tokenAddress: string,
  tokenSymbol: string,
  tokenDecimals: number,
  tokenLogo?: string
) => {
  if (!window?.ethereum?.request) {
    return undefined
  }
  // better leave this undefined for default image instead of broken image url
  const image = tokenLogo
    ? BAD_SRCS[tokenLogo]
      ? undefined
      : tokenLogo
    : undefined

  const tokenAdded = await window.ethereum.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address: tokenAddress,
        symbol: tokenSymbol,
        decimals: tokenDecimals,
        image,
      },
    },
  })

  return tokenAdded
}

// export const canRegisterToken = () =>
//   typeof window !== 'undefined' &&
//   (window?.ethereum?.isMetaMask ||
//     window?.ethereum?.isTrust ||
//     window?.ethereum?.isCoinbaseWallet ||
//     window?.ethereum?.isTokenPocket)
