import { Common } from 'layouts'
import { FC } from 'react'
import { GlobalStyle } from 'styles'
import { Routes } from './Routes'

export const App: FC = () => {
  return (
    <>
      <GlobalStyle />
      <Common>
        <Routes />
      </Common>
    </>
  )
}
