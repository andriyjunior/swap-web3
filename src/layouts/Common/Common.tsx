import { FC, ReactNode, useState } from 'react'
import { Menu } from 'components'
import styled from 'styled-components'
import { gradients } from 'styles'
import { Header } from 'components'

interface ICommonProps {
  children: ReactNode
}

const StyleRoot = styled.div`
  background: ${gradients.bg};
  background-size: 100vw 100vh;
  background-attachment: fixed;
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
  const [isCollapsed, setCollapsed] = useState(false)

  const handleCollapsedToogle = () => {
    setCollapsed((prev) => !prev)
  }

  return (
    <StyleRoot>
      <Menu isCollapsed={isCollapsed} />
      <StyleBody>
        <Header
          handleCollapsedToogle={handleCollapsedToogle}
          isCollapsed={isCollapsed}
        />
        {children}
      </StyleBody>
    </StyleRoot>
  )
}
