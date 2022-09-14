import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
import { BlockNumberProvider } from 'context'
import { ReactNode, FC } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from 'store'
import { ErrorBoundary } from './ErrorBoundary'
interface IProvidersProps {
  children: ReactNode
}

export const Providers: FC<IProvidersProps> = ({ children }) => {
  return (
    <>
      <ErrorBoundary>
        <BrowserRouter>
          <Provider store={store}>
            <Web3ReactProvider
              getLibrary={(provider) => new Web3Provider(provider)}
            >
              <BlockNumberProvider>{children}</BlockNumberProvider>
            </Web3ReactProvider>
          </Provider>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  )
}
