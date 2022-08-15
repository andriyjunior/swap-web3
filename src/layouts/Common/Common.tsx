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
`

const StyleBody = styled.div``

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
