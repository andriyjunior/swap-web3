import { Web3Provider } from '@ethersproject/providers'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { useCallback } from 'react'
import { removeSelectedWallet, useAppDispatch } from 'store'
import {
  connectorsByName,
  ConnectorNames,
  ConnectorType,
  setupNetwork,
} from 'utils'

const defaultNetwork = Number(process.env.REACT_APP_DEFAULT_NETWORK) || 1

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const { active, account, activate, deactivate, setError } =
    useWeb3React<Web3Provider>()

  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const connectorOrGetConnector: any = connectorsByName[connectorID]
      const connector =
        typeof connectorOrGetConnector !== 'function'
          ? connectorsByName[connectorID]
          : await connectorOrGetConnector()

      if (typeof connector !== 'function' && connector) {
        activate(connector, async (error: Error) => {
          if (error instanceof UnsupportedChainIdError) {
            setError(error)
            const provider = await connector.getProvider()
            const hasSetup = await setupNetwork(defaultNetwork, provider)
            if (hasSetup) {
              activate(connector)
            }
          }
        })
      }
    },
    [activate, setError]
  )

  const logOut = () => {
    deactivate()
    dispatch(removeSelectedWallet())
  }

  return { login, logOut, active, account, deactivate }
}
