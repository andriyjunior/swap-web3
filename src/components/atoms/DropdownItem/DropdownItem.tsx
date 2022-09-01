import { FC } from 'react'
import styled from 'styled-components'
import { Typography } from '../Typography'
import { colors, getTransparentColor } from 'styles'

interface IDropdownItem {
  children: string
  onClick: () => void
}

const StyledButton = styled.button`
  width: 100%;
  height: 44px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border: none;

  &:hover > * {
    color: ${colors.black};
    transition: color 0.2s ease-in;
  }
`

const StyledTitle = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`

export const DropdownItem: FC<IDropdownItem> = ({ children, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <StyledTitle>{children}</StyledTitle>
    </StyledButton>
  )
}
