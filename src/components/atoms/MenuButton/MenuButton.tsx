import { motion } from 'framer-motion'
import { FC } from 'react'

import {
  StyledButton,
  StyledButtonLink,
  StyledIcon,
  StyledIconWrapper,
  StyledSoon,
  StyledTitle,
} from './styled'

interface IMenuButtonProps {
  to?: string
  title: string
  icon: string
  isCollapsed: boolean
  onClick?: () => void
  soon?: boolean
}

export const MenuButton: FC<IMenuButtonProps> = ({
  title,
  icon,
  to,
  isCollapsed,
  onClick,
  soon,
}) => {
  const Icon = () => (
    <StyledIconWrapper>
      <StyledIcon src={icon} />
      {soon && <StyledSoon>Soon</StyledSoon>}
    </StyledIconWrapper>
  )

  const Component = ({ children }) =>
    to ? (
      <StyledButtonLink to={to}>{children}</StyledButtonLink>
    ) : (
      <StyledButton onClick={onClick}>{children}</StyledButton>
    )

  return (
    <Component>
      <Icon />
      {!isCollapsed && <StyledTitle>{title}</StyledTitle>}
    </Component>
  )
}
