import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { resetLocalStorage } from './utils'
import persistStore from 'redux-persist/es/persistStore'
import storage from 'redux-persist/lib/storage'
import user from './features/user/reducer'
import mint from './features/mint/reducer'
import multicall from './features/multicall/reducer'
import transactions from './features/transactions/reducer'

const reducers = combineReducers({ user, multicall, mint, transactions })

const persistConfig = {
  key: 'root',
  version: 1.0002,
  storage,
  whitelist: ['user'],
}

resetLocalStorage(persistConfig.version, persistConfig.key)

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export default persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
