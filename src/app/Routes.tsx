import { FC } from 'react'
import {
  Navigate,
  Route,
  Routes as ReactRoutes,
  useParams,
} from 'react-router-dom'
import { Home, SwapPage } from 'pages'
import { LiquidityForm, SwapForm } from 'components'

// interface IRoutesProps {}

export const Routes: FC = () => {
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
      <Route path="/farms" element={<Navigate to={'/swap'} />} />
      <Route path="/staking" element={<Navigate to={'/swap'} />} />
      <Route path="/games" element={<Navigate to={'/swap'} />} />
      <Route path="*" element="404" />
    </ReactRoutes>
  )
}
