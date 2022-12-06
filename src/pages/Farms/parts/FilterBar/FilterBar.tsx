import { Button, Dropdown, DropdownItem, Flex, Input } from 'components'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { borderRadius, colors } from 'styles'

export enum sortEnum {
  All,
  Liquidity,
  Multiplier,
  ARP,
  Earned,
}

interface IFilterBarProps {
  onChangeQuerry: (e: string) => void
  onChangeSort: (value: sortEnum) => void
}

export const options = [
  {
    key: sortEnum.All,
    value: 'All',
  },
  {
    key: sortEnum.Liquidity,
    value: 'Liquidity',
  },
  {
    key: sortEnum.Multiplier,
    value: 'Multipler',
  },
  {
    key: sortEnum.ARP,
    value: 'APR',
  },
  {
    key: sortEnum.Earned,
    value: 'Earned',
  },
]

const StyledRoot = styled.div`
  margin-top: 32px;
  padding: 8px 10px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${colors.white};
  border-radius: ${borderRadius.primary};
`

const StyledLeft = styled(Flex)`
  flex-shrink: 2;
  flex-grow: 0;
`
const StyledRight = styled(Flex)`
  flex-shrink: 0;
  min-width: 134px;
`

export const FilterBar: FC<IFilterBarProps> = ({
  onChangeQuerry,
  onChangeSort,
}) => {
  const [filters, setFilters] = useState<{
    search: string
    filter: { key: number; value: string }
  }>({ search: '', filter: options[0] })

  const handleSearch = (e) => {
    setFilters((prev) => {
      return { ...prev, search: e }
    })
  }

  const handleFilter = (e) => {
    setFilters((prev) => {
      return { ...prev, filter: e }
    })
  }

  useEffect(() => {
    onChangeQuerry(filters.search)
  }, [filters.search])

  useEffect(() => {
    onChangeSort(filters.filter.key)
  }, [filters.filter])

  const { t } = useTranslation()

  return (
    <StyledRoot>
      <StyledLeft gap="10px">
        <Input
          value={filters.search}
          onInput={handleSearch}
          placeholder={t('Search')}
          height="44px"
        />
        <Dropdown
          title={filters.filter.value}
          options={options}
          onSelect={handleFilter}
        />
      </StyledLeft>
      <StyledRight>
        <Button onClick={() => {}}>{t('Harvest All')}</Button>
      </StyledRight>
    </StyledRoot>
  )
}
