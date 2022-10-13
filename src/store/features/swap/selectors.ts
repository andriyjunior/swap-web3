import get from 'lodash/get'
import { RootState } from 'store/store'
import { PairDataTimeWindowEnum } from './types'

type pairByDataIdSelectorParams = {
  pairId: string
  timeWindow: PairDataTimeWindowEnum
}

export const pairByDataIdSelector =
  ({ pairId, timeWindow }: pairByDataIdSelectorParams) =>
  (state: RootState) =>
    get(state, ['swap', 'pairDataById', pairId, timeWindow])

export const derivedPairByDataIdSelector =
  ({ pairId, timeWindow }: pairByDataIdSelectorParams) =>
  (state: RootState) =>
    get(state, ['swap', 'derivedPairDataById', pairId, timeWindow])
