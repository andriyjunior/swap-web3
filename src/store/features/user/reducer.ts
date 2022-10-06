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

function pairKey(token0Address: string, token1Address: string) {
  return `${token0Address};${token1Address}`
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
    addSerializedToken(state, { payload: { serializedToken } }) {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[serializedToken.chainId] =
        state.tokens[serializedToken.chainId] || {}
      state.tokens[serializedToken.chainId][serializedToken.address] =
        serializedToken
      state.timestamp = currentTimestamp()
    },
    removeSerializedToken(state, { payload: { address, chainId } }) {
      if (!state.tokens) {
        state.tokens = {}
      }
      state.tokens[chainId] = state.tokens[chainId] || {}
      delete state.tokens[chainId][address]
      state.timestamp = currentTimestamp()
    },
    addSerializedPair(state, { payload: { serializedPair } }) {
      if (
        serializedPair.token0.chainId === serializedPair.token1.chainId &&
        serializedPair.token0.adress !== serializedPair.token1.adress
      ) {
        const { chainId } = serializedPair.token0
        state.pairs[chainId] = state.pairs[chainId] || {}
        state.pairs[chainId][
          pairKey(serializedPair.token0.address, serializedPair.token1.address)
        ] = serializedPair
      }
      state.timestamp = currentTimestamp()
    },
    removeSerializedPair(
      state,
      { payload: { chainId, tokenAAddress, tokenBAddress } }
    ) {
      if (state.pairs[chainId]) {
        // just delete both keys if either exists
        delete state.pairs[chainId][pairKey(tokenAAddress, tokenBAddress)]
        delete state.pairs[chainId][pairKey(tokenBAddress, tokenAAddress)]
      }
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
  addSerializedToken,
  removeSerializedToken,
  addSerializedPair,
  removeSerializedPair,
} = userSlice.actions

export default userSlice.reducer
