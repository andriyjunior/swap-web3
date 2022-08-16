import { FC } from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import logo from 'assets/logo.svg'
import logoNmb from 'assets/logo-number.svg'

const StyledRoot = styled.div<{ isCollapsed: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 56px;
`

const StyledImg = styled.img``

export const BigLogo: FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  return (
    <StyledRoot isCollapsed={isCollapsed}>
      <NavLink to="/">
        {!isCollapsed && <StyledImg src={logo} />}
        {isCollapsed && <StyledImg src={logoNmb} />}
      </NavLink>
    </StyledRoot>
  )
}
