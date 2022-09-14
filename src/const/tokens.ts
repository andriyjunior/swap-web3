import { ChainId, Token } from 'packages/swap-sdk'

const SEVN_MAINNET = new Token(
  ChainId.MAINNET,
  '0x2c3f07314ba8dA7A99E50BB1B9a3Dfd659881E63',
  18,
  'SEVN',
  'SEVN Token'
)

const SEVN_TESTNET = new Token(
  ChainId.ROPSTEN,
  '0x2c3f07314ba8dA7A99E50BB1B9a3Dfd659881E63',
  18,
  'SEVN',
  'SEVN Token'
)

const WETH_TESTNET = new Token(
  ChainId.ROPSTEN,
  '0xc778417E063141139Fce010982780140Aa0cD5Ab',
  18,
  'WETH',
  'Wrapped Ether'
)

export const SEVN = {
  [ChainId.MAINNET]: SEVN_MAINNET,
  [ChainId.ROPSTEN]: SEVN_TESTNET,
}

export const WETH = {
  //TODO: Change to MAINNET WETH token
  [ChainId.MAINNET]: WETH_TESTNET,
  [ChainId.ROPSTEN]: WETH_TESTNET,
}

export const USDT_TESTNET = new Token(
  ChainId.ROPSTEN,
  '0x738e997fc917fe7F0b51dfa9A5939507B3E6A154',
  6,
  'USDT',
  'Tether USD'
)

export const USDT = {
  //TODO: Change to ROPSTEN WETH token
  [ChainId.MAINNET]: USDT_TESTNET,
  [ChainId.ROPSTEN]: USDT_TESTNET,
}
