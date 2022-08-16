import { Flex } from 'components'
import styled from 'styled-components'
import { colors } from 'styles'

export const StyledPage = styled(Flex)`
  padding-top: 80px;
`

export const StyledRoot = styled(Flex)`
  border-radius: 8px;
  width: 502px;
  background-color: ${colors.white};
  align-items: flex-start;
`

export const StyledTabs = styled(Flex)`
  width: 100%;
`

export const StyledContent = styled.div`
  width: 100%;
  padding: 16px;
`
