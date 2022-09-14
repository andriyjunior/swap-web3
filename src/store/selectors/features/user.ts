import { RootState } from 'store/store'

export const selectUser = (state: RootState) => state.user
export const selectGasPrice = (state: RootState) => state.user.gasPrice
export const selectUserDeadline = (state: RootState) => {
  return state.user.userDeadline / 60
}
export const selectUserDeadlineRaw = (state: RootState) => {
  return state.user.userDeadline
}
export const selectUserSlippageTolerance = (state: RootState) => {
  return state.user.userSlippageTolerance
}
