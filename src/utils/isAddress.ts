import { getAddress } from 'ethers/lib/utils'
import { memoize } from 'lodash'

export const isAddress = memoize((value: any): string | false => {
  try {
    return getAddress(value)
  } catch {
    return false
  }
})
