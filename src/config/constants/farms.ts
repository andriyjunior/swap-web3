import { ChainId } from 'packages/swap-sdk'
import { tokens } from './tokens'
import { FarmConfig } from './types'

const farms: FarmConfig[] = [
  /**
   * These 3 farms (PID 0, 1) should always be at the top of the file.
   */

  {
    pid: 0,
    lpSymbol: 'SEVN-USDT LP',
    lpAddresses: {
      [ChainId.MAINNET]: '',
      [ChainId.TESTNET]: '0x40D6bE9542002D17F260808814225785Af75d32f',
    },
    token: tokens.sevn, //SEVN
    quoteToken: tokens.usdt, //USDT
  },
  {
    pid: 1,
    lpSymbol: 'SEVN-SFT2 LP',
    lpAddresses: {
      [ChainId.MAINNET]: '',
      [ChainId.TESTNET]: '0x8fb909f36774EF4EdCc66a5B62D0AcC2674C6327',
    },
    token: tokens.sevn, //SEVN
    quoteToken: tokens.sft2, //SFT2
  },
]

export default farms
