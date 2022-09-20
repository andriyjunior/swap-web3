import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Settings } from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { useModalRef } from 'hooks'

import { RemoveLiquidity, LiquidityPool, AddLiquidity } from './parts'
import { useNavigate, useParams } from 'react-router-dom'

enum TabsEnum {
  Add,
  Remove,
}

interface ILiquidityForm {
  isRemoveTab?: boolean
}

export const LiquidityForm: FC<ILiquidityForm> = ({ isRemoveTab }) => {
  const navigate = useNavigate()
  const { userCurrencyA, userCurrencyB } = useParams()
  const [currentTab, setCurrentTab] = useState(TabsEnum.Add)

  useEffect(() => {
    if (isRemoveTab) {
      setCurrentTab(TabsEnum.Remove)
    }
  }, [isRemoveTab])

  const { t } = useTranslation()

  const settingsModalRef = useModalRef()

  const handleOnGoBack = () => {
    setCurrentTab(TabsEnum.Add)
    navigate('/swap/add')
  }

  const tabs = {
    [TabsEnum.Add]: (
      <AddLiquidity
        onOpenSettings={() => settingsModalRef.current?.open()}
        userCurrencyA={userCurrencyA}
        userCurrencyB={userCurrencyB}
      />
    ),
    [TabsEnum.Remove]: (
      <RemoveLiquidity
        onGoBack={handleOnGoBack}
        userCurrencyA={userCurrencyA}
        userCurrencyB={userCurrencyB}
      />
    ),
  }

  const handleOnRemove = () => {
    setCurrentTab(TabsEnum.Remove)
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={t('settings')}>
          <Settings />
        </Modal>

        {tabs[currentTab]}
        <LiquidityPool onRemove={handleOnRemove} />
      </motion.div>
    </AnimatePresence>
  )
}
