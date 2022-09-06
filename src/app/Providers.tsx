import { Web3Provider } from '@ethersproject/providers'
import { Web3ReactProvider } from '@web3-react/core'
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
          <Web3ReactProvider
            getLibrary={(provider) => new Web3Provider(provider)}
          >
            <Provider store={store}>{children}</Provider>
          </Web3ReactProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  )
}
