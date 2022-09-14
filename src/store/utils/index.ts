import { BigNumber } from 'ethers'

export * from './hooks'
export * from './resetLocalStorage'

export function calculateGasMargin(value: BigNumber, margin = 1000): BigNumber {
  return value
    .mul(BigNumber.from(10000).add(BigNumber.from(margin)))
    .div(BigNumber.from(10000))
}
