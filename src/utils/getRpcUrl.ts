import random from 'lodash/random'
import { ChainId } from 'packages/swap-sdk'

// Network RPC nodes
export const NETWORK_RPC = {
  [ChainId.TESTNET]: [
    'https://eth-goerli.nodereal.io/v1/ef1d356208e544918ae9e2bc78b71429',
  ],
  [ChainId.MAINNET]: [
    'https://eth-mainnet.nodereal.io/v1/43f9100965104de49b580d1fa1ab28c0',
  ],
}

export const getNodeUrl = (chainId: number) => {
  const randomIndex = random(0, NETWORK_RPC[chainId].length - 1)
  return NETWORK_RPC[5][randomIndex]
}
