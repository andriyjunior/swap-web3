import { FC } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'

interface ITitleProps {
  text: string
}

const StyledText = styled.h4`
  margin: 0;
  padding: 0;
  color: ${colors.black};
  font-size: 26px;
  font-weight: 700;
`

export const Title: FC<ITitleProps> = ({ text }) => {
  return <StyledText>{text}</StyledText>
}
