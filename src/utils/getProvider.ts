import { ethers } from 'ethers'
import { getNodeUrl } from './getRpcUrl'

/**
 * Provides a web3 instance using our own private provider httpProver
 */

const activeWeb3Instance = {}

export const getProvider = (chainId: number) => {
  if (!activeWeb3Instance[chainId]) {
    const RPC_URL = getNodeUrl(chainId)
    activeWeb3Instance[chainId] = new ethers.providers.JsonRpcProvider(
      RPC_URL,
      chainId
    )
  }
  return activeWeb3Instance[chainId]
}
