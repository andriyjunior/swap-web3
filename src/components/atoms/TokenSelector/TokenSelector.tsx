import { FC } from 'react'
import styled from 'styled-components'
import { Icon } from '../Icon'
import { BoldTitle } from '../Typography'

import arrow_icon from 'assets/icons/arrow.svg'
import { colors, getTransparentColor } from 'styles'

interface ITokenSelectorProps {
  title: string
  icon: string
  onClick?: () => void
}

const StyledRoot = styled.button`
  padding: 5px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  border-radius: 8px;
  transition: background-color 0.1s ease-in;

  &:hover {
    background-color: ${getTransparentColor(colors.black, 0.05)};
  }
`

const StyledCoinIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledText = styled(BoldTitle)`
  padding: 0 5px;
`

const StyledArrowIcon = styled(Icon)`
  opacity: 0.5;
  transition: opacity 0.1s ease-in;

  &:hover {
    opacity: 1;
  }
`

export const TokenSelector: FC<ITokenSelectorProps> = ({
  title,
  icon,
  onClick,
}) => {
  return (
    <StyledRoot onClick={onClick}>
      <StyledCoinIcon src={icon} />
      <StyledText>{title}</StyledText>
      <StyledArrowIcon src={arrow_icon} />
    </StyledRoot>
  )
}