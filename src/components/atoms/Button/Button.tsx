import { FC } from 'react'

import { StyledRoot, StyledTitle } from './styled'

interface IButtonProps {
  title: string
  onClick: () => void
}

export const Button: FC<IButtonProps> = ({ title, onClick }) => {
  return (
    <StyledRoot onClick={onClick}>
      <StyledTitle>{title}</StyledTitle>
    </StyledRoot>
  )
}
