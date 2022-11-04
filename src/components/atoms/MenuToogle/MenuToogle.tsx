import { FC } from 'react'
import styled from 'styled-components'

import menuToggle_icon from 'assets/icons/menu-toogle.svg'
import { breakpoints } from 'styles'

const StyledToogle = styled.button<{ isCollapsed: boolean }>`
  position: absolute;
  background: none;
  border: none;
  left: -16px;
  top: 24px;
  transform: ${({ isCollapsed }) =>
    isCollapsed ? 'rotateZ(-180deg)' : 'rotateZ(0deg)'};
  transition: transform 0.2s ease-in;

  @media (max-width: ${breakpoints.md}) {
    display: none;
  }
`
const StyledToogleIcon = styled.img``

interface IMenuToogleProps {
  isCollapsed: boolean
  handleCollapsedToogle: () => void
}

export const MenuToogle: FC<IMenuToogleProps> = ({
  isCollapsed,
  handleCollapsedToogle,
}) => {
  return (
    <StyledToogle isCollapsed={isCollapsed} onClick={handleCollapsedToogle}>
      <StyledToogleIcon src={menuToggle_icon} alt="" />
    </StyledToogle>
  )
}
