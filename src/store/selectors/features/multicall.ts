import { RootState } from 'store/store'

export const selectMulticallResults = (state: RootState) =>
  state.multicall.callResults
