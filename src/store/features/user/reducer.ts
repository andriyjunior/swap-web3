import { createSlice } from '@reduxjs/toolkit'
import { SerializedToken } from 'abis'
import { GAS_PRICE_GWEI } from 'const'

export interface SerializedPair {
  token0: SerializedToken
  token1: SerializedToken
}

const currentTimestamp = () => new Date().getTime()

interface IInitialState {
  selectedWallet?: string

  // the timestamp of the last updateVersion action
  lastUpdateVersionTimestamp?: number

  // matchesDarkMode: boolean // whether the dark mode media query matches

  // userDarkMode: boolean | null // the user's choice for dark mode or light mode

  //   userClientSideRouter: boolean // whether routes should be calculated with the client side router only

  // hides closed (inactive) positions across the app
  //   userHideClosedPositions: boolean

  // user defined slippage tolerance in bips, used in all txns
  userSlippageTolerance: string
  gasPrice: string
  //   userSlippageToleranceHasBeenMigratedToAuto: boolean // temporary flag for migration status

  // deadline set by user in minutes, used in all txns
  userDeadline: number

  tokens: {
    [chainId: number]: {
      [address: string]: SerializedToken
    }
  }

  pairs: {
    [chainId: number]: {
      // keyed by token0Address:token1Address
      [key: string]: SerializedPair
    }
  }

  timestamp: number
  //   URLWarningVisible: boolean

  // undefined means has not gone through A/B split yet
  //   showSurveyPopup: boolean | undefined

  //   showDonationLink: boolean
}

const initialState: IInitialState = {
  selectedWallet: undefined,
  userSlippageTolerance: '1',
  gasPrice: GAS_PRICE_GWEI.testnet,
  userDeadline: 900,
  timestamp: currentTimestamp(),
  //   userExpertMode: false,
  //   userLocale: null,
  //   userClientSideRouter: false,
  //   userHideClosedPositions: false,
  //   userSlippageToleranceHasBeenMigratedToAuto: true,
  tokens: {},
  pairs: {},
  //   URLWarningVisible: true,
  //   showSurveyPopup: undefined,
  //   showDonationLink: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateSelectedWallet(state, { payload }) {
      state.selectedWallet = payload
      state.timestamp = currentTimestamp()
    },
    updateSlippageTolerance(state, { payload }) {
      state.userSlippageTolerance = payload
      state.timestamp = currentTimestamp()
    },
    updateUserDeadline(state, { payload }) {
      state.userDeadline = payload * 60
      state.timestamp = currentTimestamp()
    },
    updateUserGasPrice(state, { payload }) {
      state.gasPrice = payload
      state.timestamp = currentTimestamp()
    },
    removeSelectedWallet(state) {
      state.selectedWallet = undefined
      state.timestamp = currentTimestamp()
    },
  },
})

export const {
  updateSelectedWallet,
  removeSelectedWallet,
  updateSlippageTolerance,
  updateUserDeadline,
  updateUserGasPrice,
} = userSlice.actions

export default userSlice.reducer
