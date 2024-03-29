import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  ApprovalState,
  useActiveWeb3React,
  useApproveCallback,
  useCurrency,
  useModalRef,
  usePairWithoutLiquidity,
} from 'hooks'
import { Field } from 'types'
import {
  Typography,
  Flex,
  IconButton,
  Button,
  InnerContainer,
  Modal,
  TransactionSubmited,
  TokenInput,
  WalletConnection,
  TextMessage,
} from 'components'

import icon_plus from 'assets/icons/plus.svg'
import { ConfirmSupply } from '../ConfirmSupply'

import {
  useMintState,
  useDerivedMintInfo,
  useMintActionHandlers,
  useCurrencyBalances,
} from 'store'
import { TokenAmount } from 'packages/swap-sdk'
import { getTokenUrlByAddress, maxAmountSpend } from 'utils'
import { useCurrencySelectRoute } from 'pages/Swap/hooks'
import { SEVN, USDT } from 'const'
import { ONE_BIPS, ROUTER_ADDRESS } from 'config'

import wallet_icon from 'assets/icons/wallet.svg'
import { useOnAdd } from './hooks'
import { breakpoints } from 'styles'

const StyledPlusIcon = styled.img`
  margin: 10px 0;
`

const StyledPricesAndPool = styled(Flex)`
  padding-bottom: 20px;
`

const StyledPriceOrPool = styled(Flex)`
  @media (max-width: ${breakpoints.md}) {
    padding: 0 2px;
  }
`

const StyledText = styled(Typography.Body)`
  display: flex;
  flex-wrap: wrap;

  @media (max-width: ${breakpoints.md}) {
    font-size: 10px;
    text-align: center;
  }
`

const StyledSupplyWrapper = styled.div`
  margin-top: 16px;
`

interface IAddLiquidity {
  userCurrencyA?: string
  userCurrencyB?: string
  onOpenSettings: () => void
}

export const AddLiquidity: FC<IAddLiquidity> = ({
  onOpenSettings,
  userCurrencyA,
  userCurrencyB,
}) => {
  const [liquidityFormShown, setLiquidityFormShown] = useState(false)

  const { account, chainId } = useActiveWeb3React()

  const walletsRef = useModalRef()
  const confirmSupplyRef = useModalRef()
  const txSubmitedRef = useModalRef()

  useEffect(() => {
    if (userCurrencyA || userCurrencyB) {
      setLiquidityFormShown(true)
    }
  }, [userCurrencyA, userCurrencyB])

  const SEVN_ADDRESS = chainId && SEVN[chainId].address
  const USDT_ADDRESS = chainId && USDT[chainId].address

  const [currencyIdA, currencyIdB] = [
    userCurrencyA ? userCurrencyA : SEVN_ADDRESS,
    userCurrencyB ? userCurrencyB : USDT_ADDRESS,
  ]

  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const { t } = useTranslation()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error,
    addError,
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)

  const [_, pairWithoutLiquidity] = usePairWithoutLiquidity(
    currencies[Field.CURRENCY_A],
    currencies[Field.CURRENCY_B]
  )

  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const { handleCurrencyASelect, handleCurrencyBSelect } =
    useCurrencySelectRoute({ path: 'liquidity' })

  const formattedAmounts = useMemo(
    () => ({
      [independentField]: typedValue,
      [dependentField]: noLiquidity
        ? otherTypedValue
        : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
    }),
    [
      dependentField,
      independentField,
      noLiquidity,
      otherTypedValue,
      parsedAmounts,
      typedValue,
    ]
  )

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [
    Field.CURRENCY_A,
    Field.CURRENCY_B,
  ].reduce((accumulator, field) => {
    return {
      ...accumulator,
      [field]: maxAmountSpend(currencyBalances[field]),
    }
  }, {})

  const { attemptingTxn, liquidityErrorMessage, txHash, onAdd } = useOnAdd(
    currencyA,
    currencyB,
    parsedAmounts,
    noLiquidity,
    currencies,
    pair ? pair : pairWithoutLiquidity
  )

  const handleResetLiquidityInputs = () => {
    if (txHash) {
      onFieldAInput('0')
      onFieldBInput('0')
    }
  }

  useEffect(() => {
    if (txHash) {
      txSubmitedRef.current?.open()
      handleResetLiquidityInputs()
    }
  }, [txHash])

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_A],
    ROUTER_ADDRESS[chainId ?? 1]
  )
  const [approvalB, approveBCallback] = useApproveCallback(
    parsedAmounts[Field.CURRENCY_B],
    ROUTER_ADDRESS[chainId ?? 1]
  )

  const showFieldAApproval =
    approvalA === ApprovalState.NOT_APPROVED ||
    approvalA === ApprovalState.PENDING
  const showFieldBApproval =
    approvalB === ApprovalState.NOT_APPROVED ||
    approvalB === ApprovalState.PENDING

  const isValid = !error && !addError

  const buttonDisabled =
    !isValid ||
    approvalA !== ApprovalState.APPROVED ||
    approvalB !== ApprovalState.APPROVED

  const poolTokenPercentageAmount =
    noLiquidity && price
      ? '100'
      : (poolTokenPercentage?.lessThan(ONE_BIPS)
          ? '<0.01'
          : poolTokenPercentage?.toFixed(2)) ?? '0'

  const icons = [
    getTokenUrlByAddress(currencyIdA),
    getTokenUrlByAddress(currencyIdB),
  ]

  const [balanceInput, balanceOutput] = useCurrencyBalances(
    account ?? undefined,
    [currencies[Field.CURRENCY_A], currencies[Field.CURRENCY_B]]
  )

  return (
    <>
      <Typography.Header4>{t('liquidityForm.addLiquidity')}</Typography.Header4>

      <Modal title={t('confirmSupply.youWillRecieve')} ref={confirmSupplyRef}>
        <ConfirmSupply
          price={price}
          onSupply={() => {
            onAdd()
            confirmSupplyRef.current?.close()
          }}
          amounts={formattedAmounts}
          currencies={currencies}
          shareOfPool={poolTokenPercentageAmount}
          liquidityMinted={liquidityMinted}
          icons={icons}
        />
      </Modal>

      <Modal
        title={t('transactionSubmited.transactionSubmited')}
        ref={txSubmitedRef}
        onClose={handleResetLiquidityInputs}
      >
        <TransactionSubmited
          currencyToAdd={
            pair ? pair?.liquidityToken : pairWithoutLiquidity?.liquidityToken
          }
          onClose={() => {
            handleResetLiquidityInputs()
            txSubmitedRef.current?.close()
          }}
          txHash={txHash}
        />
      </Modal>

      <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
        <WalletConnection onClick={() => walletsRef.current?.close()} />
      </Modal>

      <Flex alignItems="center" justifyContent="space-between">
        <Typography.Title>
          {t('liquidityForm.addLiquidityToReceiveLpTokens')}
        </Typography.Title>

        <IconButton icon="settings" onClick={onOpenSettings} />
      </Flex>

      {!account && (
        <Button
          title={t('Connect wallet')}
          icon={wallet_icon}
          onClick={() => walletsRef.current?.open()}
        />
      )}

      {account && !liquidityFormShown && (
        <Button
          title={t('liquidityForm.addLiquidity')}
          onClick={() => chainId && setLiquidityFormShown(true)}
        />
      )}

      {liquidityFormShown && account && (
        <>
          {noLiquidity && (
            <TextMessage
              title={t('You are the first liquidity provider')}
              desc={
                'The ratio of tokens you add will set the price of this pool. Once you are happy with the rate click supply to review.'
              }
            />
          )}

          <TokenInput
            title="&nbsp;"
            currency={currencies[Field.CURRENCY_A]}
            tokenName={currencies[Field.CURRENCY_A]?.symbol ?? ''}
            icon={icons[0]}
            amount={formattedAmounts[Field.CURRENCY_A]}
            onInput={onFieldAInput}
            onSelectToken={handleCurrencyASelect}
            balance={balanceInput}
            onMax={onFieldAInput}
          />
          <Flex justifyContent="center" alignItems="center">
            <StyledPlusIcon src={icon_plus} />
          </Flex>
          <TokenInput
            title="&nbsp;"
            currency={currencies[Field.CURRENCY_B]}
            tokenName={currencies[Field.CURRENCY_B]?.symbol ?? ''}
            icon={icons[1]}
            amount={formattedAmounts[Field.CURRENCY_B]}
            onInput={onFieldBInput}
            onSelectToken={handleCurrencyBSelect}
            balance={balanceOutput}
            onMax={onFieldBInput}
          />
          <Typography.Title>
            {t('liquidityForm.pricesAndPoolShare')}
          </Typography.Title>
          <InnerContainer>
            <StyledPricesAndPool
              justifyContent="space-between"
              alignItems="center"
            >
              <StyledPriceOrPool alignItems="center" flexDirection="column">
                <Typography.Title>
                  {price?.toSignificant(6) ?? '-'}
                </Typography.Title>
                <StyledText>
                  {currencies?.CURRENCY_B?.symbol}&nbsp;per&nbsp;
                  {currencies?.CURRENCY_A?.symbol}
                </StyledText>
              </StyledPriceOrPool>
              <StyledPriceOrPool alignItems="center" flexDirection="column">
                <Typography.Title>
                  {price?.invert()?.toSignificant(6) ?? '-'}
                </Typography.Title>
                <StyledText>
                  {currencies?.CURRENCY_A?.symbol}&nbsp;per&nbsp;
                  {currencies?.CURRENCY_B?.symbol}
                </StyledText>
              </StyledPriceOrPool>
              <StyledPriceOrPool alignItems="center" flexDirection="column">
                <Typography.Title>
                  {poolTokenPercentageAmount}%
                </Typography.Title>
                <StyledText>Share of Pool</StyledText>
              </StyledPriceOrPool>
            </StyledPricesAndPool>
          </InnerContainer>

          {(showFieldAApproval || showFieldBApproval) && (
            <StyledSupplyWrapper>
              <Flex justifyContent="space-between" gap="10px">
                <Button
                  title={t('approve A')}
                  onClick={approveACallback}
                  isDisabled={!showFieldAApproval}
                />
                <Button
                  title={t('approve B')}
                  onClick={approveBCallback}
                  isDisabled={!showFieldBApproval}
                />
              </Flex>
            </StyledSupplyWrapper>
          )}

          <StyledSupplyWrapper>
            <Button
              isDisabled={buttonDisabled}
              title={addError || t('supply')}
              onClick={() => {
                confirmSupplyRef.current?.open()
              }}
            />
          </StyledSupplyWrapper>
        </>
      )}
    </>
  )
}
