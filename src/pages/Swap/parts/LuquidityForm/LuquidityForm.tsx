import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Modal, Settings } from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { useModalRef } from 'hooks'

import { AddLiquidity, RemoveLiquidity, LiquidityPool } from './parts'

interface ISwapProps {
  userCurrencyA?: string
  userCurrencyB?: string
}

enum TabsEnum {
  Add,
  Remove,
}

export const LuquidityForm: FC<ISwapProps> = ({
  userCurrencyA,
  userCurrencyB,
}) => {
  const [currentTab, setCurrentTab] = useState(TabsEnum.Add)

  const { t } = useTranslation()

  const settingsModalRef = useModalRef()

  const handleOnGoBack = () => {
    setCurrentTab(TabsEnum.Add)
  }

  const tabs = {
    [TabsEnum.Add]: (
      <AddLiquidity
        onOpenSettings={() => settingsModalRef.current?.open()}
        userCurrencyA={userCurrencyA}
        userCurrencyB={userCurrencyB}
      />
    ),
    [TabsEnum.Remove]: <RemoveLiquidity onGoBack={handleOnGoBack} />,
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
