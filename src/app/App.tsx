import { Loader } from 'components'
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
      <Common>
        <Loader />
        <Routes />
      </Common>
    </>
  )
}
