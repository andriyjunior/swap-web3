import { motion } from 'framer-motion'
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
  onClick?: () => void
}

export const MenuButton: FC<IMenuButtonProps> = ({
  title,
  icon,
  to,
  isCollapsed,
  onClick,
}) => {
  return to ? (
    <StyledButtonLink to={to}>
      <StyledIcon src={icon} />
      {!isCollapsed && <StyledTitle>{title}</StyledTitle>}
    </StyledButtonLink>
  ) : (
    <StyledButton onClick={onClick}>
      <StyledIcon src={icon} />
      {!isCollapsed && <StyledTitle>{title}</StyledTitle>}
    </StyledButton>
  )
}
