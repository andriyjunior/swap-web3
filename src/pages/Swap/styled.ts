import { Flex } from 'components'
import styled from 'styled-components'
import { breakpoints, colors, shadows } from 'styles'

export const StyledPage = styled(Flex)`
  padding-top: 80px;

  @media (max-width: ${breakpoints.md}px) {
    padding: 80px 16px 0;
  }
`

export const StyledRoot = styled(Flex)`
  border-radius: 8px;
  width: 502px;
  background-color: ${colors.white};
  align-items: flex-start;
  box-shadow: ${shadows.main};

  @media (max-width: ${breakpoints.md}px) {
    width: 100%;
  }
`

export const StyledTabs = styled(Flex)`
  width: 100%;
`

export const StyledContent = styled.div`
  width: 100%;
  padding: 16px;
`
