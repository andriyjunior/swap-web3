import { FC, ReactNode } from 'react'
import styled from 'styled-components'

import styles from './Flex.module.scss'

type TJusifyContent =
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'flex-start'
  | 'flex-end'

type TAlignItems = 'center' | 'flex-start' | 'flex-end'

interface IStyledRoot {
  justifyContent?: TJusifyContent
  alignItems?: TAlignItems
  flexDirection?: 'column' | 'row'
}

const StyledRoot = styled.div<IStyledRoot>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  flex-direction: ${(props) => props.flexDirection};
`

export const Flex = StyledRoot
