import { Button, Dropdown, DropdownItem, Flex, Input } from 'components'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { borderRadius, colors } from 'styles'

// interface IFilterBarProps {}

const options = [
  {
    key: 0,
    value: 'All',
  },
  {
    key: 1,
    value: 'Liquidity',
  },
  {
    key: 2,
    value: 'Multipler',
  },
  {
    key: 3,
    value: 'APR',
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

export const FilterBar: FC = () => {
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
