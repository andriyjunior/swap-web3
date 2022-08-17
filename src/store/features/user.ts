import { createSlice } from '@reduxjs/toolkit'
import { UserType } from 'types'

interface IInitialState {
  accountAddress: string
  accountBalance: string
}

const initialState: IInitialState = {
  accountAddress: '',
  accountBalance: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    saveUser(state, { payload }: { payload: UserType }) {
      state.accountAddress = payload.accountAddress
      state.accountBalance = payload.accountBalance
    },
    logOut() {
      return initialState
    },
  },
})

const { actions, reducer } = userSlice

export const { saveUser, logOut } = actions

export default reducer
