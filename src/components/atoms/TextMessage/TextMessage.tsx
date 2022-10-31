import { FC } from 'react'
import styled from 'styled-components'
import { borderRadius, colors } from 'styles'
import { Typography } from '../Typography'

interface ITextMessageProps {
  variant?: 'warning' | 'error' | 'success'
  title: string
  desc: string
}

const StyledRoot = styled.div`
  padding: 10px 16px;
  border: 1px solid ${colors.warning};
  border-radius: ${borderRadius.primary};
`

const StyledTitle = styled(Typography.BodyBold)`
  color: ${colors.warning};
`

const StyledDesc = styled(Typography.Body)`
  color: ${colors.warning};
`

export const TextMessage: FC<ITextMessageProps> = ({
  variant = 'danger',
  title,
  desc,
}) => {
  return (
    <StyledRoot>
      <StyledTitle>{title}</StyledTitle>
      <StyledDesc>{desc}</StyledDesc>
    </StyledRoot>
  )
}
