import { BigNumber } from '@ethersproject/bignumber'
import { useSingleCallResult } from 'store'
import { useMulticallContract } from './useContract'

// gets the current timestamp from the blockchain
export const useCurrentBlockTimestamp = (): BigNumber | undefined => {
  const multicall = useMulticallContract()
  return useSingleCallResult(multicall, 'getCurrentBlockTimestamp')?.result?.[0]
}
