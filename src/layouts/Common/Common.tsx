import { FC, ReactNode, useEffect, useState } from 'react'
import { Menu, Toast, ToastsContainer } from 'components'
import styled from 'styled-components'
import { gradients } from 'styles'
import { Header } from 'components'
import { useIsMobile } from 'hooks'

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
  const [isCollapsed, setCollapsed] = useState(true)

  const isMobile = useIsMobile()

  useEffect(() => {
    setCollapsed(isMobile)
  }, [isMobile])

  const handleCollapsedToogle = () => {
    setCollapsed((prev) => !prev)
  }

  console.log(isMobile)

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
