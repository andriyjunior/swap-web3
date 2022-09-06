import { InnerContainer, Flex, Typography } from 'components/atoms'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { getTransparentColor, colors } from 'styles'

export const StyledArrowButton = styled.button`
  padding-right: 24px;
  background-color: transparent;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 22px;
`
export const StyledArrowIcon = styled.img`
  margin: 10px 0;
`

export const StyledTextCss = css`
  font-weight: 700;
  font-size: 10px;
  color: ${getTransparentColor(colors.black, 0.5)};
`

export const StyledContainer = styled(InnerContainer)`
  padding: 20px;
  margin-top: 16px;
`

export const StyledHeaderContainer = styled(Flex)`
  padding-bottom: 10px;
`

export const StyledAmount = styled.span`
  ${StyledTextCss}
`

export const StyledDetailed = styled(NavLink)`
  ${StyledTextCss}
  color: ${colors.purple};

  &:hover {
    text-decoration: underline;
  }
`

export const StyledRadioContainer = styled(Flex)`
  padding-top: 10px;
`

export const StyledPriceContainer = styled(Flex)`
  padding: 16px 0;
`

export const StyledTokenLiquidityAmount = styled(Typography.Title)`
  color: ${getTransparentColor(colors.black, 0.5)};
`
export const StyledTokenPrice = styled(Typography.Body)`
  color: ${getTransparentColor(colors.black, 0.5)};
`
