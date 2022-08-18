import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Typography, IconButton, Button, Modal, TModal } from 'components'
import { AnimatePresence, motion } from 'framer-motion'

// interface ISwapProps {}

export const LuquidityForm: FC = () => {
  const { t } = useTranslation()

  const settingsModalRef = useRef<TModal>(null)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={'Setting'}>
          Setting
        </Modal>

        <Typography.Header4>
          {t('liquidityForm.addLiquidity')}
        </Typography.Header4>

        <Flex alignItems="center" justifyContent="space-between">
          <Typography.Title>
            {t('liquidityForm.addLiquidityToReceiveLpTokens')}
          </Typography.Title>

          <IconButton
            icon="settings"
            onClick={() => settingsModalRef.current?.open()}
          />
        </Flex>
        <Button title={t('liquidityForm.addLiquidity')} onClick={() => {}} />
        <Typography.Title>{t('liquidityForm.yourLiquidity')}</Typography.Title>
      </motion.div>
    </AnimatePresence>
  )
}
