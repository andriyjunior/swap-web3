import { ChainId } from 'packages/swap-sdk'
import { InjectedConnector } from '@web3-react/injected-connector'

export type ConnectorType = InjectedConnector

export enum ConnectorNames {
  Injected = 'injected',
  // WalletConnect = "walletconnect",
  // BSC = "bsc",
  // Blocto = "blocto",
  // WalletLink = "coinbaseWallet",
}

const POLLING_INTERVAL = 12000

const SUPPORTED_CHAIN_ID = [ChainId.MAINNET, ChainId.TESTNET]

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_CHAIN_ID,
})

export const connectorsByName = {
  [ConnectorNames.Injected]: injected,
  //   [ConnectorNames.WalletConnect]: walletconnect,
  //   [ConnectorNames.BSC]: bscConnector,
  //   [ConnectorNames.Blocto]: async () => {
  //     const { BloctoConnector } = await import('@blocto/blocto-connector')
  //     return new BloctoConnector({
  //       chainId: ChainId.BSC,
  //       rpc: 'https://bsc.nodereal.io',
  //     })
  //   },
  //   [ConnectorNames.WalletLink]: async () => {
  //     const { WalletLinkConnector } = await import(
  //       '@web3-react/walletlink-connector'
  //     )
  //     return new WalletLinkConnector({
  //       url: 'https://pancakeswap.finance',
  //       appName: 'PancakeSwap',
  //       appLogoUrl: 'https://pancakeswap.com/logo.png',
  //       supportedChainIds: SUPPORTED_CHAIN_ID,
  //     })
  //   },
} as const
