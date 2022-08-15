import { Common } from 'layouts'
import { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobalStyle } from 'styles'
import { Routes } from './Routes'

export const App: FC = () => {
  return (
    <>
      <GlobalStyle />

      <Routes />
    </>
  )
}
