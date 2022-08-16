import { SwapForm, Tab } from 'components'
import { FC, useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyledPage, StyledRoot, StyledTabs, StyledContent } from './styled'
import { TabsEmum } from './types'

// interface ISwapProps {}

const tabContent = {
  [TabsEmum.Swap]: <SwapForm />,
  [TabsEmum.Liquidity]: <></>,
}

export const Swap: FC = () => {
  const [activeTab, setActiveTab] = useState(TabsEmum.Swap)

  const { t } = useTranslation()

  const handleClick = useCallback((value: TabsEmum) => {
    setActiveTab(value)
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
