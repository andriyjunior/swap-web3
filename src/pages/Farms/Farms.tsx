import BigNumber from 'bignumber.js'
import { Container, Flex, Typography } from 'components'
import { orderBy } from 'lodash'
import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import { Farm, useFarms, usePriceCakeBusd } from 'store'
import styled from 'styled-components'
import { getBalanceNumber, getFarmApr, isArchivedPid, latinise } from 'utils'

import { FilterBar, FarmTable, options, sortEnum } from './parts'
import { IRowProps } from './parts/Row'
import { FarmWithStakedValue } from './parts/types.t'

interface IFarmsProps {
  children?: ReactNode
}

const StyledPage = styled(Container)``

const StyledTitle = styled(Typography.Header4)``

export const Farms: FC<IFarmsProps> = () => {
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const { data: farmsLP, userDataLoaded } = useFarms()

  const isArchived = pathname.includes('archived')
  const isInactive = pathname.includes('history')
  const isActive = !isInactive && !isArchived

  const cakePrice = usePriceCakeBusd()

  const [sortOption, setSortOption] = useState(options[0].key)
  const [query, setQuery] = useState('')
  const [stakedOnly, setStakedOnly] = useState(!isActive)

  const handleChangeQuery = (value: string) => {
    setQuery(value)
  }

  const handleChangeSort = (value) => {
    setSortOption(value)
  }

  useEffect(() => {
    setStakedOnly(!isActive)
  }, [isActive])

  const activeFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier !== '0X' && !isArchivedPid(farm.pid)
  )
  const inactiveFarms = farmsLP.filter(
    (farm) =>
      farm.pid !== 0 && farm.multiplier === '0X' && !isArchivedPid(farm.pid)
  )
  const archivedFarms = farmsLP.filter((farm) => isArchivedPid(farm.pid))

  const stakedOnlyFarms = activeFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const stakedInactiveFarms = inactiveFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const stakedArchivedFarms = archivedFarms.filter(
    (farm) =>
      farm.userData &&
      new BigNumber(farm.userData.stakedBalance).isGreaterThan(0)
  )

  const farmsList = useCallback(
    (farmsToDisplay: Farm[]): FarmWithStakedValue[] => {
      let farmsToDisplayWithAPR: FarmWithStakedValue[] = farmsToDisplay.map(
        (farm) => {
          if (!farm.lpTotalInQuoteToken || !farm.quoteToken.busdPrice) {
            return farm
          }
          const totalLiquidity = new BigNumber(farm.lpTotalInQuoteToken).times(
            farm.quoteToken.busdPrice
          )
          const apr =
            isActive && cakePrice && farm.poolWeight
              ? getFarmApr(
                  new BigNumber(farm.poolWeight),
                  cakePrice,
                  totalLiquidity
                )
              : 0

          return { ...farm, apr, liquidity: totalLiquidity }
        }
      )

      if (query) {
        const lowercaseQuery = latinise(query.toLowerCase())
        farmsToDisplayWithAPR = farmsToDisplayWithAPR.filter(
          (farm: FarmWithStakedValue) => {
            return latinise(farm.lpSymbol.toLowerCase()).includes(
              lowercaseQuery
            )
          }
        )
      }
      return farmsToDisplayWithAPR
    },
    [cakePrice, query, isActive]
  )

  const farmsStakedMemoized = useMemo(() => {
    let farmsStaked: any = []

    const sortFarms = (farms: FarmWithStakedValue[]): FarmWithStakedValue[] => {
      switch (sortOption) {
        case sortEnum.ARP:
          return orderBy(farms, (farm: FarmWithStakedValue) => farm.apr, 'desc')
        case sortEnum.Multiplier:
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.multiplier ? Number(farm.multiplier.slice(0, -1)) : 0,
            'desc'
          )
        case sortEnum.Earned:
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) =>
              farm.userData ? Number(farm.userData.earnings) : 0,
            'desc'
          )
        case sortEnum.Liquidity:
          return orderBy(
            farms,
            (farm: FarmWithStakedValue) => Number(farm.liquidity),
            'desc'
          )
        default:
          return farms
      }
    }

    if (isActive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedOnlyFarms)
        : farmsList(activeFarms)
    }
    if (isInactive) {
      farmsStaked = stakedOnly
        ? farmsList(stakedInactiveFarms)
        : farmsList(inactiveFarms)
    }
    if (isArchived) {
      farmsStaked = stakedOnly
        ? farmsList(stakedArchivedFarms)
        : farmsList(archivedFarms)
    }

    // return sortFarms(farmsStaked).slice(0, numberOfFarmsVisible)
    return sortFarms(farmsStaked).slice(0)
  }, [
    sortOption,
    activeFarms,
    farmsList,
    inactiveFarms,
    archivedFarms,
    isActive,
    isInactive,
    isArchived,
    stakedArchivedFarms,
    stakedInactiveFarms,
    stakedOnly,
    stakedOnlyFarms,
    // numberOfFarmsVisible,
  ])

  const rowData = farmsStakedMemoized.map((farm) => {
    const { token, quoteToken } = farm
    const tokenAddress = token.address
    const quoteTokenAddress = quoteToken.address
    const lpLabel =
      farm.lpSymbol &&
      farm.lpSymbol.split(' ')[0].toUpperCase().replace('PANCAKE', '')

    // const row: RowProps = {
    const row: IRowProps | any = farm.userData
      ? {
          apr: {
            value:
              farm.apr &&
              farm.apr.toLocaleString('en-US', { maximumFractionDigits: 2 }),
            multiplier: farm.multiplier,
            lpLabel,
            tokenAddress,
            quoteTokenAddress,
            cakePrice,
            originalValue: farm.apr,
          },
          farm: {
            image: farm.lpSymbol.split(' ')[0].toLocaleLowerCase(),
            label: lpLabel,
            pid: farm.pid,
          },
          earned: {
            earnings: getBalanceNumber(new BigNumber(farm.userData.earnings)),
            pid: farm.pid,
          },
          liquidity: {
            liquidity: farm.liquidity,
          },
          multiplier: {
            multiplier: farm.multiplier,
          },
          details: farm,
        }
      : {}

    return row
  })

  return (
    <StyledPage>
      <StyledTitle>{t('Farms')}</StyledTitle>
      <FilterBar
        onChangeQuerry={handleChangeQuery}
        onChangeSort={handleChangeSort}
      />
      <FarmTable data={rowData} />
    </StyledPage>
  )
}
