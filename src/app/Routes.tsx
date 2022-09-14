import { FC } from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'
import { Home, Swap } from 'pages'
// interface IRoutesProps {}

export const Routes: FC = () => {
  return (
    <ReactRoutes>
      <Route path="/" element={<Home />} />
      <Route path="/swap">
        <Route index element={<Swap />} />
        <Route path=":userCurrencyA" element={<Swap />} />
        <Route path=":userCurrencyA/:userCurrencyB" element={<Swap />} />
      </Route>
      <Route path="/swap/add">
        <Route index element={<Swap isAddTab />} />
        <Route path=":userCurrencyA" element={<Swap isAddTab />} />
        <Route
          path=":userCurrencyA/:userCurrencyB"
          element={<Swap isAddTab />}
        />
      </Route>
      <Route path="/farms" element="Farms" />
      <Route path="/staking" element="Staking" />
      <Route path="/games" element="Games" />
      <Route path="*" element="404" />
    </ReactRoutes>
  )
}
