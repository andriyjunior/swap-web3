import { useWeb3React } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
// eslint-disable-next-line import/no-unresolved
import { Web3ReactContextInterface } from '@web3-react/core/dist/types'
import { ChainId } from 'packages/swap-sdk'
import { infuraProvider } from 'utils'
import { getProvider } from 'utils/getProvider'
import { useEffect, useRef, useState } from 'react'

/**
 * Provides a web3 provider with or without user's signer
 * Recreate web3 instance only if the provider change
 */
export const useActiveWeb3React = () => {
  const { library, chainId, account, ...web3React } = useWeb3React()

  //TODO: save last chain id ot smth like that
  const appChainId = chainId || 5
  const appProvider = getProvider(appChainId)
  const currChainId = chainId || appChainId
  const refChainId = useRef(currChainId)
  const refEth = useRef(library || appProvider)
  const [provider, setProvider] = useState(library || appProvider)

  useEffect(() => {
    if (library !== refEth.current || appProvider !== refEth.current) {
      setProvider(library || appProvider)
      refEth.current = library || appProvider
      refChainId.current = currChainId
    }
  }, [library, appProvider, currChainId])

  // To allow the app to update before passing a chainId !== provider
  if (currChainId !== refChainId.current) {
    return {
      library: refEth.current,
      chainId: refChainId.current,
      account,
      ...web3React,
    }
  }

  return { library: provider, chainId: currChainId, account, ...web3React }
}
