import { FC } from 'react'
import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'
import { Typography } from '../Typography'

interface IWallet {
  icon: string
  title: string
  onClick: () => void
}

const StyledRoot = styled.button`
  padding: 10px 0;
  width: 145px;
  background: none;
  border: none;
  transition: background-color 0.2s ease-in;
  border-radius: ${borderRadius.primary};

  &:hover {
    background-color: ${getTransparentColor(colors.black, 0.05)};
  }

  &:active {
    background-color: ${getTransparentColor(colors.black, 0.5)};
  }
`

const StyledIcon = styled.img`
  margin-bottom: 10px;
  width: 42px;
  height: 42px;
  filter: drop-shadow(${shadows.logo});
`

export const Wallet: FC<IWallet> = ({ icon, title, onClick }) => {
  return (
    <StyledRoot onClick={onClick}>
      <StyledIcon src={icon} />
      <Typography.Body>{title}</Typography.Body>
    </StyledRoot>
  )
}
