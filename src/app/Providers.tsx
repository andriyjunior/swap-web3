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
          <Provider store={store}>{children}</Provider>
        </BrowserRouter>
      </ErrorBoundary>
    </>
  )
}
