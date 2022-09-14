import { BigNumber } from '@ethersproject/bignumber'
import { useMemo } from 'react'
import {
  selectUserDeadline,
  selectUserDeadlineRaw,
  useAppSelector,
} from 'store'
import { useCurrentBlockTimestamp } from './useCurrentBlockTimestamp'

// combines the block timestamp with the user setting to give the deadline that should be used for any submitted transaction
export const useTransactionDeadline = (): BigNumber | undefined => {
  const ttl = useAppSelector(selectUserDeadlineRaw)

  const blockTimestamp = useCurrentBlockTimestamp()
  return useMemo(() => {
    if (blockTimestamp && ttl) {
      return blockTimestamp.add(ttl)
    }
    return undefined
  }, [blockTimestamp, ttl])
}
