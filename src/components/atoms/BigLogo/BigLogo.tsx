import { FC } from 'react'
import styled from 'styled-components'

import logo from 'assets/logo.svg'
import logoNmb from 'assets/logo-number.svg'
import { NavLink } from 'react-router-dom'

const StyledRoot = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BigLogo: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  return (
    <StyledRoot>
      <NavLink to="/">
        <img src={isCollapsed ? logoNmb : logo} />
      </NavLink>
    </StyledRoot>
  )
}
