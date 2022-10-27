import { FC, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Accordion,
  Button,
  CoinPair,
  Flex,
  Modal,
  SelectToken,
  SimpleButton,
  TokenInput,
  TokenSelector,
  Typography,
} from 'components'

import { colors, getTransparentColor } from 'styles'

import { useNavigate } from 'react-router-dom'
import { paths, SEVN, USDT } from 'const'
import {
  Field,
  toV2LiquidityToken,
  usePairAdder,
  useTokenBalancesWithLoadingIndicator,
  useTrackedTokenPairs,
} from 'store'
import {
  PairState,
  useActiveWeb3React,
  useModalRef,
  usePair,
  usePairs,
} from 'hooks'
import { LiquidityItem } from './parts'
import { Currency, Token } from 'packages/swap-sdk'
import { getTokenUrlByAddress } from 'utils'

const StyledFooter = styled.div`
  padding-top: 36px;
`

const StyledSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-bottom: 16px;
`

interface ILiquidityPool {
  onRemove: () => void
}

export const LiquidityPool: FC<ILiquidityPool> = ({ onRemove }) => {
  const { account, chainId } = useActiveWeb3React()
  const [independField, setIndependField] = useState(Field.CURRENCY_A)

  const [selectedTokens, setSelectedTokens] = useState<{
    [Field.CURRENCY_A]?: Token
    [Field.CURRENCY_B]?: Token
  }>({
    [Field.CURRENCY_A]: SEVN[chainId],
    [Field.CURRENCY_B]: USDT[chainId],
  })

  const [_, foundPair] = usePair(
    selectedTokens?.[Field.CURRENCY_A],
    selectedTokens?.[Field.CURRENCY_B]
  )

  const addPair = usePairAdder()

  const { t } = useTranslation()
  const importModalRef = useModalRef()
  const selectModalRef = useModalRef()

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()

  const tokenPairsWithLiquidityTokens = useMemo(
    () =>
      trackedTokenPairs.map((tokens) => ({
        liquidityToken: toV2LiquidityToken(tokens),
        tokens,
      })),
    [trackedTokenPairs]
  )

  const liquidityTokens = useMemo(
    () => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken),
    [tokenPairsWithLiquidityTokens]
  )

  const [v2PairsBalances, fetchingV2PairBalances] =
    useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(
    liquidityTokensWithBalances.map(({ tokens }) => tokens)
  )
  const v2IsLoading =
    fetchingV2PairBalances ||
    v2Pairs?.length < liquidityTokensWithBalances.length ||
    (v2Pairs?.length &&
      v2Pairs.every(([pairState]) => pairState === PairState.LOADING))

  const allV2PairsWithLiquidity = v2Pairs
    ?.filter(
      ([pairState, pair]) => pairState === PairState.EXISTS && Boolean(pair)
    )
    .map(([, pair]) => pair)

  const handleOpenSelector = () => {
    if (selectModalRef.current && importModalRef.current) {
      selectModalRef.current.open()
      importModalRef.current.close()
    }
  }

  const handleOnSelect = (token) => {
    setSelectedTokens((prev) => {
      return { ...prev, ...{ [independField]: token } }
    })
    if (selectModalRef.current && importModalRef.current) {
      importModalRef.current.open()
      selectModalRef.current.close()
    }
  }

  const handleImportPair = () => {
    if (foundPair) {
      addPair(foundPair)
      if (importModalRef.current) {
        importModalRef.current.close()
      }
    }
  }

  return (
    <>
      <Modal ref={importModalRef} title={t('importPool')}>
        <StyledSelector>
          <TokenSelector
            token={
              selectedTokens?.[Field.CURRENCY_A]
                ? selectedTokens?.CURRENCY_A
                : undefined
            }
            hasArrow
            onClick={() => {
              handleOpenSelector()
              setIndependField(Field.CURRENCY_A)
            }}
          />
          <TokenSelector
            token={
              selectedTokens?.[Field.CURRENCY_B]
                ? selectedTokens?.CURRENCY_B
                : undefined
            }
            hasArrow
            onClick={() => {
              handleOpenSelector()
              setIndependField(Field.CURRENCY_B)
            }}
          />
        </StyledSelector>
        <Button onClick={handleImportPair}>{t('import')}</Button>
      </Modal>
      <Modal ref={selectModalRef} title={t('selectToken.selectToken')}>
        <SelectToken onSelect={handleOnSelect} />
      </Modal>
      {account && (
        <>
          <Typography.Title>
            {v2IsLoading ? 'Loading' : t('liquidityForm.yourLiquidity')}
          </Typography.Title>
          {!allV2PairsWithLiquidity.length ||
            allV2PairsWithLiquidity.map((pair) => {
              return (
                <LiquidityItem
                  key={pair?.token0?.symbol + '' + pair?.token0?.address}
                  pair={pair}
                />
              )
            })}
        </>
      )}

      {account && (
        <StyledFooter>
          <SimpleButton
            onClick={() => importModalRef.current?.open()}
            variant="secondary"
          >
            {t('importPool')}
          </SimpleButton>
        </StyledFooter>
      )}
    </>
  )
}
