import { UnsupportedChainIdError } from '@web3-react/core'
import { useCallback, useEffect } from 'react'
import { removeSelectedWallet, useAppDispatch } from 'store'
import {
  connectorsByName,
  ConnectorNames,
  ConnectorType,
  setupNetwork,
} from 'utils'
import { useActiveWeb3React } from './useActiveWeb3React'
import { useToast } from './useToast'

const defaultNetwork = Number(process.env.REACT_APP_DEFAULT_NETWORK) || 5

const allowedWallets = ['0x671cCB956597A05622eC5C019AEF36dD46E20bdd']

export const useAuth = () => {
  const dispatch = useAppDispatch()

  const { toastError } = useToast()

  const { active, account, activate, deactivate, setError } =
    useActiveWeb3React()

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

  // Check for wallet permission for TESTNET
  useEffect(() => {
    if (account && !allowedWallets.includes(account)) {
      logOut()

      toastError('Your wallet is not allowed')
    }
  }, [account])

  return { login, logOut, active, account, deactivate }
}
