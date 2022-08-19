import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

const StyledRoot = styled.div`
  padding: 24px 0 0;
`

const StyledHr = styled.div`
  content: '';
  width: 100%;
  height: 1px;
  background-color: ${getTransparentColor(colors.black, 0.05)};
`

export const HorizontalSeparator: FC = () => {
  return (
    <StyledRoot>
      <StyledHr />
    </StyledRoot>
  )
}
