import { ChainId } from 'packages/swap-sdk'

export const etherscan = {
  [ChainId.MAINNET]: 'https://etherscan.io/',
  [ChainId.TESTNET]: 'https://goerli.etherscan.io/',
}
