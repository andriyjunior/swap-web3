import { parseUnits } from 'ethers/lib/utils'
import { GAS_PRICE } from 'types'

export const GAS_PRICE_GWEI = {
  default: parseUnits(GAS_PRICE.Default, 'gwei').toString(),
  fast: parseUnits(GAS_PRICE.Fast, 'gwei').toString(),
  instant: parseUnits(GAS_PRICE.Instant, 'gwei').toString(),
}

export * from './lists'
