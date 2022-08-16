import { FC } from 'react'
import styled from 'styled-components'
import { Icon } from 'components'
import { shadows } from 'styles'

interface IIconButtonProps {
  icon: string
  onClick: () => void
}

const StyledButton = styled.button`
  background: none;
  border: none;
  transition: filter 0.1s ease-in;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(${shadows.violetSm});

  &:hover {
    filter: drop-shadow(${shadows.violet});
  }

  &:active {
    filter: none;
  }
`

const StyledImg = styled(Icon)``

export const IconButton: FC<IIconButtonProps> = ({ icon, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <StyledImg src={icon} />
    </StyledButton>
  )
}
