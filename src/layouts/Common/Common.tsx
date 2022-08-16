import { FC, ReactNode } from 'react'
import { Menu } from 'components'
import styled from 'styled-components'
import { gradients } from 'styles'
import { Header } from 'components'

interface ICommonProps {
  children: ReactNode
}

const StyleRoot = styled.div`
  background: ${gradients.bg};
  background-blend-mode: normal, luminosity, normal, normal;
  display: flex;
  width: 100%;
`

const StyleBody = styled.div`
  width: 100%;
  flex-grow: 0;
  flex-shrink: 1;
`

export const Common: FC<ICommonProps> = ({ children }) => {
  return (
    <StyleRoot>
      <Menu />
      <StyleBody>
        <Header />
        {children}
      </StyleBody>
    </StyleRoot>
  )
}
