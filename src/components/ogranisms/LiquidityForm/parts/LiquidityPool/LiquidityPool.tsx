import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Accordion, Button, CoinPair, Flex, Typography } from 'components'

import { colors, getTransparentColor } from 'styles'

import { useNavigate } from 'react-router-dom'
import { paths } from 'const'
import {
  toV2LiquidityToken,
  useTokenBalancesWithLoadingIndicator,
  useTrackedTokenPairs,
} from 'store'
import { PairState, usePairs } from 'hooks'
import { useWeb3React } from '@web3-react/core'
import { LiquidityItem } from './parts'

interface ILiquidityPool {
  onRemove: () => void
}

export const LiquidityPool: FC<ILiquidityPool> = ({ onRemove }) => {
  const { account } = useWeb3React()

  const { t } = useTranslation()

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

  return (
    <>
      <Typography.Title>
        {v2IsLoading ? 'Loading' : t('liquidityForm.yourLiquidity')}
      </Typography.Title>

      {!allV2PairsWithLiquidity.length ||
        allV2PairsWithLiquidity.map((pair) => {
          return <LiquidityItem key={pair?.token0.symbol} pair={pair} />
        })}
    </>
  )
}
