import { FC, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  TokenInput,
  Modal,
  TModal,
} from 'components'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'

import wallet_icon from 'assets/icons/wallet.svg'
import { AnimatePresence, motion } from 'framer-motion'

// interface ISwapProps {}

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAppSelector(selectUser)
  const { connect } = useMetaMask()

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

        <Typography.Header4>{t('swapForm.swapTokens')}</Typography.Header4>

        <Flex alignItems="center" justifyContent="space-between">
          <Typography.Title>
            {t('swapForm.tradeTokensInAnInstant')}
          </Typography.Title>

          <IconButton
            icon="settings"
            onClick={() => settingsModalRef.current?.open()}
          />
        </Flex>

        <TokenInput title={t('swapForm.youSell')} />

        <Flex justifyContent="center">
          <IconButton icon="swap" onClick={() => {}} />
        </Flex>

        <TokenInput title={t('swapForm.youBuy')} />

        {!accountAddress && (
          <Button
            title={t('Connect wallet')}
            icon={wallet_icon}
            onClick={connect}
          />
        )}
      </motion.div>
    </AnimatePresence>
  )
}
