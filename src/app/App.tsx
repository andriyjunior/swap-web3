import { CheckNetwork, Loader } from 'components'
import { ToastListener } from 'context'
import { Common } from 'layouts'
import { FC } from 'react'
import { GlobalStyle } from 'styles'
import { Routes } from './Routes'
import { Updaters } from './Updaters'

export const App: FC = () => {
  return (
    <>
      <Updaters />
      <GlobalStyle />
      <ToastListener />
      <Common>
        <Loader />
        <Routes />
      </Common>
      <CheckNetwork />
    </>
  )
}
