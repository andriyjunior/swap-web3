import { FC, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tab } from 'components'
import { TabsEmum } from './types'
import { StyledPage, StyledRoot, StyledTabs, StyledContent } from './styled'

// interface ISwapProps {}

export const SwapPage: FC = () => {
  const { pathname } = useLocation()

  const [activeTab, setActiveTab] = useState(TabsEmum.Swap)

  useEffect(() => {
    if (pathname.includes('add') || pathname.includes('remove')) {
      setActiveTab(TabsEmum.Liquidity)
    } else {
      setActiveTab(TabsEmum.Swap)
    }
  }, [pathname])

  const { t } = useTranslation()

  return (
    <StyledPage
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
    >
      <StyledRoot
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <StyledTabs>
          <Tab
            to="/swap"
            title={t('swap')}
            isActive={activeTab === TabsEmum.Swap}
            onClick={() => {}}
          />
          <Tab
            to={'/swap/add'}
            title={t('liquidity')}
            isActive={activeTab === TabsEmum.Liquidity}
            onClick={() => {}}
          />
        </StyledTabs>
        <StyledContent>
          <Outlet />
        </StyledContent>
      </StyledRoot>
    </StyledPage>
  )
}
