import { FC } from 'react'
import styled from 'styled-components'
import { colors } from 'styles'

const StyledHeader4 = styled.h4`
  margin: 0;
  padding: 0;
  text-align: left;
  color: ${colors.black};
  font-size: 26px;
  font-weight: 700;
`

const StyledBoldTitle = styled.p`
  margin: 0;
  padding: 0;
  color: ${colors.black};
  font-size: 14px;
  font-weight: 700;
`

const StyledTitle = styled.p`
  margin: 0;
  padding: 0;
  color: ${colors.black};
  font-size: 14px;
  font-weight: 700;
`

export const Header4 = StyledHeader4
export const BoldTitle = StyledBoldTitle
export const Title = StyledTitle
