import { FC } from 'react'

import more_icon from 'assets/icons/more.svg'
import { baseMenu } from '../Menu/const'
import { MenuButton } from 'components/atoms'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor, zIndexes } from 'styles'

// interface IMobileMenuProps {}

const StyledRoot = styled.div`
  position: fixed;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  background-color: ${getTransparentColor(colors.white, 0.95)};
  border: 1px solid ${getTransparentColor(colors.black, 0.05)};
  z-index: ${zIndexes.sticky};
  padding: 0 6px;
`

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const MobileMenu: FC = () => {
  const { t } = useTranslation()

  return (
    <StyledRoot>
      <StyledContainer>
        {baseMenu.map((item) => {
          return (
            <MenuButton
              {...item}
              key={item.key}
              isCollapsed
              title={t(`menu.${item.key}`)}
              icon={item.icon}
              to={item.to}
            />
          )
        })}
        <MenuButton isCollapsed title="More" icon={more_icon} soon />
      </StyledContainer>
    </StyledRoot>
  )
}
