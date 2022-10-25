import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { ChainId } from 'packages/swap-sdk'
import { infuraProvider } from 'utils'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
export const useActiveWeb3React =
  (): Web3ReactContextInterface<Web3Provider> => {
    const { library, chainId, ...web3React } = useWeb3React()

    return {
      library: library ?? infuraProvider,
      chainId: chainId ?? ChainId.TESTNET,
      ...web3React,
    }
  }
