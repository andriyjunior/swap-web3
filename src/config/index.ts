import BigNumber from 'bignumber.js'
import { ChainId } from 'packages/swap-sdk'
import { BIG_TEN } from 'utils'

export * from './constants'

export const BSC_BLOCK_TIME = 3
export const SEVN_PER_BLOCK = new BigNumber(40)
export const BLOCKS_PER_YEAR = new BigNumber(
  (60 / BSC_BLOCK_TIME) * 60 * 24 * 365
) // 10512000
export const SEVN_PER_YEAR = SEVN_PER_BLOCK.times(BLOCKS_PER_YEAR)

export const BASE_BSC_SCAN_URLS = {
  [ChainId.MAINNET]: 'https://bscscan.com',
  [ChainId.TESTNET]: 'https://testnet.bscscan.com',
}

export const DEFAULT_TOKEN_DECIMAL = new BigNumber(10).pow(18)
