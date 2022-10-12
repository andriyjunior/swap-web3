import { FC, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Flex,
  Typography,
  IconButton,
  Button,
  TokenInput,
  Modal,
  Settings,
  WalletConnection,
} from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import {
  useAllTokens,
  useCurrency,
  useModalRef,
  useWrapCallback,
  WrapType,
} from 'hooks'
import {
  selectUserSlippageTolerance,
  useAppSelector,
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSingleTokenSwapInfo,
  useSwapState,
} from 'store'
import { useWeb3React } from '@web3-react/core'
import { useSwapForm } from './hooks'

import wallet_icon from 'assets/icons/wallet.svg'
import { Token } from 'packages/swap-sdk'
import { Field } from 'store/features/swap/actions'
import { useSwapActionHandlers } from 'store/features/swap/useSwapActionHandlers'

export const SwapForm: FC = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()

  const walletsRef = useModalRef()
  const settingsModalRef = useModalRef()

  const { state, handleOnChange, handleSwapInputs } = useSwapForm()

  const loadedUrlParams = useDefaultsFromURLSearch()

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ]

  const urlLoadedTokens: Token[] = useMemo(
    () =>
      [loadedInputCurrency, loadedOutputCurrency]?.filter(
        (c): c is Token => c instanceof Token
      ) ?? [],
    [loadedInputCurrency, loadedOutputCurrency]
  )

  const defaultTokens = useAllTokens()

  const importTokensNotInDefault =
    urlLoadedTokens &&
    urlLoadedTokens.filter((token: Token) => {
      return !(token.address in defaultTokens)
    })

  // get custom setting values for user
  const [allowedSlippage] = useAppSelector(selectUserSlippageTolerance)

  const {
    independentField,
    typedValue,
    recipient,
    [Field.INPUT]: { currencyId: inputCurrencyId },
    [Field.OUTPUT]: { currencyId: outputCurrencyId },
  } = useSwapState()

  const inputCurrency = useCurrency(inputCurrencyId)
  const outputCurrency = useCurrency(outputCurrencyId)

  const {
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo(
    independentField,
    typedValue,
    inputCurrency!,
    outputCurrency!,
    recipient
  )

  const {
    wrapType,
    execute: onWrap,
    inputError: wrapInputError,
  } = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue
  )

  const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE
  const trade = showWrap ? undefined : v2Trade

  const singleTokenPrice = useSingleTokenSwapInfo(
    inputCurrencyId,
    inputCurrency!,
    outputCurrencyId,
    outputCurrency!
  )

  const parsedAmounts = showWrap
    ? {
        [Field.INPUT]: parsedAmount,
        [Field.OUTPUT]: parsedAmount,
      }
    : {
        [Field.INPUT]:
          independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
        [Field.OUTPUT]:
          independentField === Field.OUTPUT
            ? parsedAmount
            : trade?.outputAmount,
      }

  const {
    onSwitchTokens,
    onCurrencySelection,
    onUserInput,
    onChangeRecipient,
  } = useSwapActionHandlers()
  const isValid = !swapInputError
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value)
    },
    [onUserInput]
  )
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value)
    },
    [onUserInput]
  )

  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  }

  return (
    <>
      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>
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
            currency={inputCurrency || undefined}
            tokenName={inputCurrency?.symbol || ''}
            title={t('swapForm.youSell')}
            icon={state.inputToken.logoURI}
            amount={formattedAmounts[Field.INPUT]}
            onInput={handleTypeInput}
            onSelectToken={() => {}}
          />

          <Flex justifyContent="center">
            <IconButton icon="swap" onClick={onSwitchTokens} />
          </Flex>

          <TokenInput
            currency={outputCurrency || undefined}
            tokenName={outputCurrency?.symbol || ''}
            title={t('swapForm.youBuy')}
            icon={state.outputToken.logoURI}
            amount={formattedAmounts[Field.OUTPUT]}
            onInput={handleTypeOutput}
            onSelectToken={() => {}}
          />

          {!account && (
            <Button
              title={t('Connect wallet')}
              icon={wallet_icon}
              onClick={() => walletsRef.current?.open()}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </>
  )
}
