import { FC } from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import logo from 'assets/logo.svg'
// interface IRoutesProps {}

export const Routes: FC = () => {
  return (
    <ReactRoutes>
      <Route path="/" element="Home" />
      <Route path="/swap" element="Swap" />
      <Route path="/farms" element="Farms" />
      <Route path="/staking" element="Staking" />
      <Route path="/games" element="Games" />
      <Route path="*" element="404" />
    </ReactRoutes>
  )
}
