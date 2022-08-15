import { FC } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'

// interface IHeaderProps {}

const StyledRoot = styled.div`
  height: 78px;
  width: 100px;
  flex-grow: 1;
  flex-shrink: 0;
  background-color: ${getTransparentColor(colors.white, 0.25)};
`

export const Header: FC = () => {
  return <StyledRoot></StyledRoot>
}
