import { ChainId, Token } from 'packages/swap-sdk'

const SEVN_MAINNET = new Token(
  ChainId.MAINNET,
  '0xB97ba66758584b7C3F10267F6CC0cA6a4abDc3e5',
  18,
  'SEVN',
  'SEVN Token'
)

const SEVN_TESTNET = new Token(
  ChainId.TESTNET,
  '0xB97ba66758584b7C3F10267F6CC0cA6a4abDc3e5',
  18,
  'SEVN',
  'SEVN Token'
)

const WETH_TESTNET = new Token(
  ChainId.TESTNET,
  '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',
  18,
  'WETH',
  'Wrapped Ether'
)

export const SEVN = {
  [ChainId.MAINNET]: SEVN_MAINNET,
  [ChainId.TESTNET]: SEVN_TESTNET,
}

export const WETH = {
  //TODO: Change to MAINNET WETH token
  [ChainId.MAINNET]: WETH_TESTNET,
  [ChainId.TESTNET]: WETH_TESTNET,
}

export const USDT_TESTNET = new Token(
  ChainId.TESTNET,
  '0x95b2239047e495E5FdB0ec614bA03e7c1a45309C',
  6,
  'USDT',
  'Tether USD'
)

export const USDT = {
  //TODO: Change to TESTNET WETH token
  [ChainId.MAINNET]: USDT_TESTNET,
  [ChainId.TESTNET]: USDT_TESTNET,
}
