import { FC, memo } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor } from 'styles'
import { Icon } from '../Icon'
import { Typography } from '../Typography'

import arrow_icon from 'assets/icons/arrow.svg'
import BNB_icon from 'assets/coins/BNB.png'

interface ITokenSelectorProps {
  title: string
  hasArrow?: boolean
  icon?: string
  onClick?: () => void
}

const StyledRoot = styled.button`
  padding: 5px;
  display: flex;
  align-items: center;
  background: none;
  border: none;
  border-radius: ${borderRadius.primary};
  transition: background-color 0.1s ease-in;

  &:hover {
    background-color: ${getTransparentColor(colors.black, 0.05)};
  }
`

const StyledCoinIcon = styled(Icon)`
  width: 24px;
  height: 24px;
`

const StyledText = styled(Typography.BodyBold)`
  padding: 0 5px;
`

const StyledArrowIcon = styled(Icon)`
  opacity: 0.5;
  transition: opacity 0.1s ease-in;

  &:hover {
    opacity: 1;
  }
`

export const TokenSelector: FC<ITokenSelectorProps> = memo(
  ({ title, icon, onClick, hasArrow }) => {
    return (
      <StyledRoot onClick={onClick}>
        <StyledCoinIcon loading="lazy" src={icon || BNB_icon} />
        <StyledText>{title || 'BNB'}</StyledText>
        {hasArrow && <StyledArrowIcon src={arrow_icon} />}
      </StyledRoot>
    )
  }
)
