import styled from 'styled-components'
import { colors } from 'styles'

const StyledHeader3 = styled.h3`
  margin: 0;
  padding: 0;
  text-align: left;
  color: ${colors.black};
  font-size: 42px;
  font-weight: 500;
`

const StyledHeader4 = styled.h4`
  margin: 0;
  padding: 0;
  text-align: left;
  color: ${colors.black};
  font-size: 26px;
  font-weight: 700;
`

const StyledBody = styled.p<{ isError?: boolean }>`
  margin: 0;
  padding: 0;
  color: ${({ isError }) => (isError ? colors.error : colors.black)};
  font-size: 14px;
  font-weight: 500;
`

const StyledBodyBold = styled(StyledBody)`
  font-weight: 700;
`

const StyledTitle = styled.p<{ isError?: boolean }>`
  margin: 0;
  padding: 16px 0;
  color: ${({ isError }) => (isError ? colors.error : colors.black)};
  font-size: 14px;
  font-weight: 700;
`

const StyledCaption = styled.p`
  margin: 0;
  padding: 0;
  color: ${colors.black};
  font-size: 14px;
  font-weight: 300;
`

const StyledButton = styled.span`
  margin: 0;
  padding: 0;
  color: ${colors.black};
  font-size: 16px;
  font-weight: 500;
`

const StyledButtonBold = styled(StyledButton)`
  font-weight: 700;
`

const StyledSmall = styled(StyledButton)`
  font-weight: 700;
  font-size: 10px;
  color: ${colors.black};
`

export const Typography = {
  Header3: StyledHeader3,
  Header4: StyledHeader4,
  Body: StyledBody,
  BodyBold: StyledBodyBold,
  Title: StyledTitle,
  Caption: StyledCaption,
  Button: StyledButton,
  ButtonBold: StyledButtonBold,
  Small: StyledSmall,
}
