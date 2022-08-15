import { BigLogo, MenuButton } from 'components'
import { FC, useState } from 'react'
import styled from 'styled-components'
import { colorConverter, colors } from 'styles'

import dashboard_icon from 'assets/icons/dashboard.svg'
import swap_icon from 'assets/icons/swap.svg'
import games_icon from 'assets/icons/games.svg'
import more_icon from 'assets/icons/more.svg'

const StyledRoot = styled.div<{ isCollapsed: boolean }>`
  position: sticky;
  top: 0;
  width: ${({ isCollapsed }) => (isCollapsed ? '82px' : '224px')};
  height: 100vh;
  padding: 20px 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  background-color: ${colorConverter.hexToRgba(colors.white, 0.5)};
`

const StyledButtonContainer = styled.div`
  padding-top: 34px;
  display: flex;
  flex-direction: column;
`

export const Menu: FC = () => {
  const [isCollapsed, setCollapsed] = useState(false)

  return (
    <StyledRoot isCollapsed={isCollapsed}>
      <BigLogo isCollapsed={isCollapsed} />
      <StyledButtonContainer>
        <MenuButton
          isCollapsed={isCollapsed}
          title="Dashboard"
          icon={dashboard_icon}
          to="/dashboard"
        />
        <MenuButton
          isCollapsed={isCollapsed}
          title="Swap"
          icon={swap_icon}
          to="/swap"
        />
        <MenuButton
          isCollapsed={isCollapsed}
          title="Games"
          icon={games_icon}
          to="/games"
        />
        <MenuButton isCollapsed={isCollapsed} title="More" icon={more_icon} />
      </StyledButtonContainer>
    </StyledRoot>
  )
}
