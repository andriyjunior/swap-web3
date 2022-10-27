import { FC, ReactNode } from 'react'

import { StyledIcon, StyledRoot, StyledTitle } from './styled'

interface IButtonProps {
  onClick: () => void
  title?: string
  children?: ReactNode
  icon?: string
  isDisabled?: boolean
}

export const Button: FC<IButtonProps> = ({
  onClick,
  title,
  children,
  icon,
  isDisabled,
}) => {
  return (
    <StyledRoot disabled={isDisabled} onClick={onClick}>
      {icon && <StyledIcon src={icon} />}
      {title && <StyledTitle>{title}</StyledTitle>}
      {children && <StyledTitle>{children}</StyledTitle>}
    </StyledRoot>
  )
}
