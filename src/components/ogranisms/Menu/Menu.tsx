import { BigLogo, MenuButton } from 'components'
import { FC, memo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { breakpoints, colorConverter, colors, zIndexes } from 'styles'
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
  transition: width 0.2s ease-in-out;
  overflow: hidden;
  z-index: ${zIndexes.sticky};

  @media (max-width: ${breakpoints.md}) {
  }
`

const StyledButtonContainer = styled.div`
  padding-top: 34px;
  display: flex;
  flex-direction: column;
`

interface IMenu {
  isCollapsed: boolean
}

export const Menu: FC<IMenu> = memo(({ isCollapsed }) => {
  const { t } = useTranslation()

  return (
    <StyledRoot isCollapsed={isCollapsed}>
      <BigLogo isCollapsed={isCollapsed} />
      <StyledButtonContainer>
        {baseMenu.map((item) => {
          return (
            <MenuButton
              {...item}
              key={item.key}
              isCollapsed={isCollapsed}
              title={t(`menu.${item.key}`)}
              icon={item.icon}
              to={item.to}
            />
          )
        })}
        <MenuButton
          isCollapsed={isCollapsed}
          title="More"
          icon={more_icon}
          soon
        />
      </StyledButtonContainer>
    </StyledRoot>
  )
})
