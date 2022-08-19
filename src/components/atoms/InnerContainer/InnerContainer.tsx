import styled from 'styled-components'
import { borderRadius, colors, getTransparentColor, shadows } from 'styles'

const StyledInnerContainer = styled.div`
  padding: 0 10px;
  box-shadow: ${shadows.inner};
  background-color: ${colors.white};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  border-radius: ${borderRadius.primary};
`

export const InnerContainer = StyledInnerContainer
