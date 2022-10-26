import { FC, ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { Link } from 'react-router-dom'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'
import { Typography } from '../Typography'

import link_icon from 'assets/icons/linkTo.svg'
import wallet_icon from 'assets/icons/wallet.svg'

interface ISimpleButtonProps {
  children?: ReactNode
  onClick?: () => void
  href?: string
}

const commonCss = css`
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
  box-shadow: ${shadows.button};
  transition-property: box-shadow background=color;
  transition-duration: 0.1s;
  transition-timing-function: ease-in;

  &:hover {
    box-shadow: ${shadows.buttonHover};
  }

  &:active {
    background-color: ${getTransparentColor(colors.black, 0.2)};
  }
`

const StyledLink = styled.a`
  ${commonCss};
`
const StyledButton = styled.button`
  ${commonCss};
  border: none;
`

const StyledImg = styled.img`
  margin-left: 10px;
`

const StyledText = styled(Typography.ButtonBold)``

export const SimpleButton: FC<ISimpleButtonProps> = ({
  onClick,
  href,
  children,
}) => {
  return (
    <>
      {href && (
        <StyledLink href={href} target="_blank">
          {typeof children === 'string' ? (
            <StyledText>{children}</StyledText>
          ) : (
            children
          )}
          <StyledImg src={link_icon} />
        </StyledLink>
      )}
      {onClick && (
        <StyledButton onClick={onClick}>
          {typeof children === 'string' ? (
            <StyledText>{children}</StyledText>
          ) : (
            children
          )}
          <StyledImg src={wallet_icon} />
        </StyledButton>
      )}
    </>
  )
}
