import { ChainId } from 'packages/swap-sdk'
import { tokens } from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1) should always be at the top of the file.
   */
  {
    pid: 1,
    lpSymbol: 'HSW-BNB LP',
    lpAddresses: {
      [ChainId.MAINNET]: '0x27a71cb648dE0169fA75FBEA902b8E6f402B746C',
      [ChainId.TESTNET]: '',
    },
    token: tokens.cake,
    quoteToken: tokens.wbnb,
  },
  {
    pid: 2,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      [ChainId.MAINNET]: '0xC067DDB3df98EC16451211Ed24C6aBf94465Aa05',
      [ChainId.TESTNET]: '',
    },
    token: tokens.busd,
    quoteToken: tokens.wbnb,
  },
]

export default farms
