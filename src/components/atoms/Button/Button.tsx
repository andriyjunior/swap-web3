import { FC } from 'react'

import { StyledIcon, StyledRoot, StyledTitle } from './styled'

interface IButtonProps {
  title: string
  onClick: () => void
  icon?: string
}

export const Button: FC<IButtonProps> = ({ title, onClick, icon }) => {
  return (
    <StyledRoot onClick={onClick}>
      {icon && <StyledIcon src={icon} />}
      <StyledTitle>{title}</StyledTitle>
    </StyledRoot>
  )
}
