import { Tab } from 'components'
import { LuquidityForm, SwapForm } from './parts'
import { FC, useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledPage, StyledRoot, StyledTabs, StyledContent } from './styled'
import { TabsEmum } from './types'

// interface ISwapProps {}

export const Swap: FC = () => {
  const [activeTab, setActiveTab] = useState(TabsEmum.Swap)

  const { t } = useTranslation()

  const handleClick = useCallback((value: TabsEmum) => {
    setActiveTab(value)
  }, [])

  const tabContent = useMemo(() => {
    return {
      [TabsEmum.Swap]: <SwapForm />,
      [TabsEmum.Liquidity]: <LuquidityForm />,
    }
  }, [])

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
            title={t('swap')}
            isActive={activeTab === TabsEmum.Swap}
            onClick={() => handleClick(TabsEmum.Swap)}
          />
          <Tab
            title={t('liquidity')}
            isActive={activeTab === TabsEmum.Liquidity}
            onClick={() => handleClick(TabsEmum.Liquidity)}
          />
        </StyledTabs>
        <StyledContent>{tabContent[activeTab]}</StyledContent>
      </StyledRoot>
    </StyledPage>
  )
}
