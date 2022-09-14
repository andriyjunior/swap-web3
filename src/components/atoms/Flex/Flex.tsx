import styled from 'styled-components'

type TJusifyContent =
  | 'center'
  | 'space-between'
  | 'space-around'
  | 'flex-start'
  | 'flex-end'

type TAlignItems = 'center' | 'flex-start' | 'flex-end'

type TFlexDirection = 'column' | 'row' | 'column-reverse' | 'row-reverse'

interface IStyledRoot {
  justifyContent?: TJusifyContent
  alignItems?: TAlignItems
  flexDirection?: TFlexDirection
  gap?: string
}

const StyledRoot = styled.div<IStyledRoot>`
  display: flex;
  justify-content: ${(props) => props.justifyContent};
  align-items: ${(props) => props.alignItems};
  flex-direction: ${(props) => props.flexDirection};
  gap: ${(props) => props.gap};
`

export const Flex = StyledRoot
