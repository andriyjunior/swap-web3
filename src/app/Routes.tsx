import { FC } from 'react'
import {
  Navigate,
  Route,
  Routes as ReactRoutes,
  useParams,
} from 'react-router-dom'
import { Farms, Home, SwapPage } from 'pages'
import { LiquidityForm, SwapForm } from 'components'
import { isDev } from 'utils'

// interface IRoutesProps {}

export const Routes: FC = () => {
  const farmsIsVisible = Boolean(process.env.REACT_APP_FARMS_VISIBLE === 'true')

  const getRightRoute = (route, condition) => {
    return condition ? route : <Navigate to={'/swap'} />
  }

  return (
    <ReactRoutes>
      <Route path="/" element={<Navigate to={'/swap'} />} />
      <Route path="/swap" element={<SwapPage />}>
        <Route path="" element={<SwapForm />} />
        <Route path=":inputCurrency" element={<SwapForm />} />
        <Route path=":inputCurrency/:outputCurrency" element={<SwapForm />} />
      </Route>
      <Route path="/liquidity" element={<SwapPage />}>
        <Route path="" element={<LiquidityForm />}>
          <Route path=":userCurrencyA" element={<LiquidityForm />} />
          <Route
            path=":userCurrencyA/:userCurrencyB"
            element={<LiquidityForm />}
          />
        </Route>
        <Route path="remove">
          <Route index element={<LiquidityForm isRemoveTab />} />
          <Route
            path=":userCurrencyA"
            element={<LiquidityForm isRemoveTab />}
          />
          <Route
            path=":userCurrencyA/:userCurrencyB"
            element={<LiquidityForm isRemoveTab />}
          />
        </Route>
      </Route>

      {/* <Route path="/swap/add">
        <Route index element={<Swap isAddTab />} />
        <Route path=":userCurrencyA" element={<Swap isAddTab />} />
        <Route
          path=":userCurrencyA/:userCurrencyB"
          element={<Swap isAddTab />}
        />
      </Route>
      <Route path="swap/remove">
        <Route index element={<Swap isAddTab />} />
        <Route path=":userCurrencyA" element={<Swap isAddTab />} />
        <Route
          path=":userCurrencyA/:userCurrencyB"
          element={<Swap isAddTab />}
        />
      </Route> */}
      <Route path="/farms" element={getRightRoute(<Farms />, farmsIsVisible)} />
      <Route path="/staking" element={<Navigate to={'/swap'} />} />
      <Route path="/games" element={<Navigate to={'/swap'} />} />
      <Route path="*" element="404" />
    </ReactRoutes>
  )
}
