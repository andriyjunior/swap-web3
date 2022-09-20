import { createAction, createReducer } from '@reduxjs/toolkit'

export enum Field {
  LIQUIDITY_PERCENT = 'LIQUIDITY_PERCENT',
  LIQUIDITY = 'LIQUIDITY',
  CURRENCY_A = 'CURRENCY_A',
  CURRENCY_B = 'CURRENCY_B',
}

export const burnTypeInput = createAction<{ field: Field; typedValue: string }>(
  'burn/typeInputBurn'
)

export interface BurnState {
  readonly independentField: Field
  readonly typedValue: string
}

const initialState: BurnState = {
  independentField: Field.LIQUIDITY_PERCENT,
  typedValue: '0',
}

export default createReducer<BurnState>(initialState, (builder) =>
  builder.addCase(
    burnTypeInput,
    (state, { payload: { field, typedValue } }) => {
      return {
        ...state,
        independentField: field,
        typedValue,
      }
    }
  )
)
