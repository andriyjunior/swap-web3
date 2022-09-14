import { FC } from 'react'

import { StyledIcon, StyledRoot, StyledTitle } from './styled'

interface IButtonProps {
  title: string
  onClick: () => void
  icon?: string
  isDisabled?: boolean
}

export const Button: FC<IButtonProps> = ({
  title,
  onClick,
  icon,
  isDisabled,
}) => {
  return (
    <StyledRoot disabled={isDisabled} onClick={onClick}>
      {icon && <StyledIcon src={icon} />}
      <StyledTitle>{title}</StyledTitle>
    </StyledRoot>
  )
}
