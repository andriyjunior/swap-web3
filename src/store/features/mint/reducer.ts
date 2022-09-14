import { createSlice } from '@reduxjs/toolkit'
import { Field } from 'types'

export interface MintState {
  readonly independentField: Field
  readonly typedValue: string
  readonly otherTypedValue: string // for the case when there's no liquidity
}

const initialState: MintState = {
  independentField: Field.CURRENCY_A,
  typedValue: '',
  otherTypedValue: '',
}

const mintSlice = createSlice({
  name: 'mint',
  initialState,
  reducers: {
    resetMintState(state) {
      return initialState
    },
    typeInput(state, { payload: { field, typedValue, noLiquidity } }) {
      if (noLiquidity) {
        // they're typing into the field they've last typed in
        if (field === state.independentField) {
          return {
            ...state,
            independentField: field,
            typedValue,
          }
        }
        // they're typing into a new field, store the other value

        return {
          ...state,
          independentField: field,
          typedValue,
          otherTypedValue: state.typedValue,
        }
      }

      return {
        ...state,
        independentField: field,
        typedValue,
        otherTypedValue: '',
      }
    },
  },
})

export const { resetMintState, typeInput } = mintSlice.actions

export default mintSlice.reducer
