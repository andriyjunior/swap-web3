import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Tab } from 'components'
import { LuquidityForm, SwapForm } from './parts'
import { TabsEmum } from './types'
import { StyledPage, StyledRoot, StyledTabs, StyledContent } from './styled'

interface ISwapProps {
  isAddTab?: boolean
}

export const Swap: FC<ISwapProps> = ({ isAddTab }) => {
  const navigate = useNavigate()
  const { userCurrencyA, userCurrencyB } = useParams()

  const [activeTab, setActiveTab] = useState(TabsEmum.Swap)

  useEffect(() => {
    if (isAddTab) {
      setActiveTab(TabsEmum.Liquidity)
    }
  }, [isAddTab])

  const { t } = useTranslation()

  const handleClick = useCallback(
    (value: TabsEmum) => {
      if (activeTab !== value) {
        setActiveTab(value)
        navigate(value === TabsEmum.Swap ? '/swap' : '/swap/add')
      }
    },
    [activeTab]
  )

  const tabContent = useMemo(() => {
    return {
      [TabsEmum.Swap]: <SwapForm />,
      [TabsEmum.Liquidity]: (
        <LuquidityForm
          userCurrencyA={userCurrencyA}
          userCurrencyB={userCurrencyB}
        />
      ),
    }
  }, [userCurrencyA, userCurrencyB])

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
