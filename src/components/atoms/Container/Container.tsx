import styled from 'styled-components'
import { breakpoints } from 'styles'

export const Container = styled.div`
  padding-top: 40px;
  width: 1024px;
  margin: 0 auto;

  @media (max-width: ${breakpoints.xxl}) {
    width: 100%;
    padding: 40px 96px 0;
  }

  @media (max-width: ${breakpoints.lg}) {
    width: 100%;
    padding: 40px 16px 0;
  }
`
