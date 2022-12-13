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
  variant?: 'primary' | 'secondary'
  icon?: 'wallet' | 'link'
  width?: number
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

const StyledLink = styled.a<{ width?: number }>`
  ${commonCss};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
`
const StyledButton = styled.button<{ width?: number }>`
  ${commonCss};
  width: ${({ width }) => (width ? `${width}px` : '100%')};
  border: none;
`

const StyledImg = styled.img`
  margin-left: 10px;
`

const StyledText = styled(Typography.ButtonBold)<{ color: string }>`
  color: ${({ color }) => color};
`

const variants = {
  primary: colors.black,
  secondary: colors.lightBlue,
}

const icons = {
  wallet: wallet_icon,
  link: link_icon,
}

export const SimpleButton: FC<ISimpleButtonProps> = ({
  onClick,
  href,
  children,
  icon,
  variant = 'primary',
  width,
}) => {
  return (
    <>
      {href && (
        <StyledLink href={href} target="_blank" width={width}>
          {typeof children === 'string' ? (
            <StyledText color={variants[variant]}>{children}</StyledText>
          ) : (
            children
          )}
          {icon && <StyledImg src={icons[icon]} />}
        </StyledLink>
      )}
      {onClick && (
        <StyledButton onClick={onClick} width={width}>
          {typeof children === 'string' ? (
            <StyledText color={variants[variant]}>{children}</StyledText>
          ) : (
            children
          )}
          {icon && <StyledImg src={icons[icon]} />}
        </StyledButton>
      )}
    </>
  )
}
