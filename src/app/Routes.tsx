import { FC } from 'react'
import { Route, Routes as ReactRoutes } from 'react-router-dom'

// interface IRoutesProps {}

export const Routes: FC = () => {
  return (
    <ReactRoutes>
      <Route path="/" element="home" />
    </ReactRoutes>
  )
}
