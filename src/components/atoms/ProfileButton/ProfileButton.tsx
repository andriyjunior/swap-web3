import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { Typography } from '../Typography'

interface IProfileButtonProps {
  children: string
  icon?: string
  onClick: () => void
}

const StyledRoot = styled.button`
  padding: 0 16px;
  background: transparent;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  transition: background-color 0.1s ease-in;

  &:hover {
    background: ${getTransparentColor(colors.black, 0.05)};
  }

  &:active {
    background: ${getTransparentColor(colors.black, 0.5)};
  }

  span {
    color: ${colors.black};
  }
`
const StyledText = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`
const StyledIcon = styled.img``

export const ProfileButton: FC<IProfileButtonProps> = ({
  children,
  icon,
  onClick,
}) => {
  return (
    <StyledRoot onClick={onClick}>
      <>
        <StyledText>{children}</StyledText>
        {icon && <StyledIcon src={icon} />}
      </>
    </StyledRoot>
  )
}
