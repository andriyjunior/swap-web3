import { createSlice } from '@reduxjs/toolkit'
import { TransactionSpeedEnum } from 'types'

interface IInitialState {
  readonly transactionSpeed: TransactionSpeedEnum
  readonly transactionTolerance: string
  readonly transactionDeadline: string
}

const initialState: IInitialState = {
  transactionSpeed: TransactionSpeedEnum.Default,
  transactionTolerance: '0.1',
  transactionDeadline: '0',
}

const swapSlice = createSlice({
  name: 'swap',
  initialState,
  reducers: {
    updateSwapSettings(state, { payload }) {
      Object.keys(payload).forEach((key) => {
        state[key as keyof IInitialState] = payload[key]
      })
    },
  },
})

const { actions, reducer } = swapSlice

export const { updateSwapSettings } = actions

export default reducer
