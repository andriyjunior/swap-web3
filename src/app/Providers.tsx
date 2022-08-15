import { ReactNode } from 'react'
import { FC } from 'react'
import { Provider } from 'react-redux'
import { store } from 'store'

interface IProvidersProps {
  children: ReactNode
}

export const Providers: FC<IProvidersProps> = ({ children }) => {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  )
}
