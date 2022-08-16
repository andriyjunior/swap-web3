import { BigLogo, MenuButton } from 'components'
import { FC, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { colorConverter, colors } from 'styles'
import { baseMenu } from './const'

import more_icon from 'assets/icons/more.svg'

const StyledRoot = styled.div<{ isCollapsed: boolean }>`
  position: sticky;
  top: 0;
  background-color: ${colorConverter.hexToRgba(colors.white, 0.5)};
  width: ${({ isCollapsed }) => (isCollapsed ? '84px' : '224px')};
  height: 100vh;
  padding: 20px 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
  flex-grow: 1;
`

const StyledButtonContainer = styled.div`
  padding-top: 34px;
  display: flex;
  flex-direction: column;
`

export const Menu: FC = () => {
  const { t } = useTranslation()
  const [isCollapsed] = useState(false)

  return (
    <StyledRoot isCollapsed={isCollapsed}>
      <BigLogo isCollapsed={isCollapsed} />
      <StyledButtonContainer>
        {baseMenu.map((item) => {
          return (
            <MenuButton
              key={item.key}
              isCollapsed={isCollapsed}
              title={t(`menu.${item.key}`)}
              icon={item.icon}
              to={item.to}
            />
          )
        })}
        <MenuButton isCollapsed={isCollapsed} title="More" icon={more_icon} />
      </StyledButtonContainer>
    </StyledRoot>
  )
}
