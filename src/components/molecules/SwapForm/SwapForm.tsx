import { FC, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  TokenInput,
  Modal,
  TModal,
  Settings,
} from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'
import { TokenDTO } from 'types'
import { useSwapForm } from './hooks'

import wallet_icon from 'assets/icons/wallet.svg'
import allTokens from 'const/token-list-old.json'

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { accountAddress } = useAppSelector(selectUser)

  const { connect } = useMetaMask()
  const settingsModalRef = useRef<TModal>(null)

  const { state, handleOnChange, handleSwapInputs } = useSwapForm()

  const getTokenList = useMemo((): TokenDTO[] => {
    return allTokens.tokens.filter(
      (item) =>
        item?.address !== state.inputToken.address &&
        item?.address !== state.outputToken.address
    )
  }, [state])

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Modal ref={settingsModalRef} title={'Setting'}>
          <Settings />
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

        <TokenInput
          tokenName={state.inputToken.symbol}
          title={t('swapForm.youSell')}
          icon={state.inputToken.logoURI}
          amount={state.inputAmount}
          onInput={(value) => handleOnChange({ inputAmount: value })}
          onSelectToken={(value) =>
            handleOnChange({
              inputToken: value,
            })
          }
          tokenList={getTokenList}
        />

        <Flex justifyContent="center">
          <IconButton icon="swap" onClick={handleSwapInputs} />
        </Flex>

        <TokenInput
          tokenName={state.outputToken.symbol}
          title={t('swapForm.youBuy')}
          icon={state.outputToken.logoURI}
          amount={state.outputAmount}
          onInput={(value) => handleOnChange({ outputAmount: value })}
          onSelectToken={(value) =>
            handleOnChange({
              outputToken: value,
            })
          }
          tokenList={getTokenList}
        />

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
