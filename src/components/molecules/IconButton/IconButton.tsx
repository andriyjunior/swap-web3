import { FC } from 'react'
import styled from 'styled-components'
import { Icon } from 'components'
import { gradients, shadows } from 'styles'

import cross_icon from 'assets/icons/cross.svg'
import swap_icon from 'assets/icons/swap-arrows.svg'
import setting_icon from 'assets/icons/settings.svg'

interface IIconButtonProps {
  icon: 'settings' | 'swap' | 'cross'
  onClick: () => void
}

const StyledButton = styled.button`
  position: relative;
  background: ${gradients.whiteFaded};
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 8px;
  transition: filter 0.1s ease-in;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(${shadows.violetS});

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: ${gradients.white};
    z-index: -1;
    opacity: 1;
    transition: opacity 0.1s ease-in;
  }

  &:hover {
    filter: drop-shadow(${shadows.violet});
  }

  &:active {
    filter: drop-shadow(${shadows.violetXs});

    &::before {
      opacity: 0;
    }
  }
`

const StyledImg = styled(Icon)``

const icons = {
  settings: setting_icon,
  swap: swap_icon,
  cross: cross_icon,
}

export const IconButton: FC<IIconButtonProps> = ({ icon, onClick }) => {
  return (
    <StyledButton onClick={onClick}>
      <StyledImg src={icons[icon]} />
    </StyledButton>
  )
}
