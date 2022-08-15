import { FC } from 'react'

import {
  StyledButton,
  StyledButtonLink,
  StyledIcon,
  StyledTitle,
} from './styled'

interface IMenuButtonProps {
  to?: string
  title: string
  icon: string
  isCollapsed: boolean
}

export const MenuButton: FC<IMenuButtonProps> = ({
  title,
  icon,
  to,
  isCollapsed,
}) => {
  return to ? (
    <StyledButtonLink to={to}>
      <StyledIcon src={icon} />
      {!isCollapsed && <StyledTitle>{title}</StyledTitle>}
    </StyledButtonLink>
  ) : (
    <StyledButton>
      <StyledIcon src={icon} />
      {!isCollapsed && <StyledTitle>{title}</StyledTitle>}
    </StyledButton>
  )
}
