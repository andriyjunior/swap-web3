import { Address } from 'abis'
import BigNumber from 'bignumber.js'

import { Farm } from 'store'

export type ColumnsDefTypes = {
  id: number
  label: string
  name: string
  sortable: boolean
}

export const DesktopColumnSchema: ColumnsDefTypes[] = [
  {
    id: 1,
    name: 'farm',
    sortable: true,
    label: '',
  },
  {
    id: 2,
    name: 'type',
    sortable: false,
    label: '',
  },
  {
    id: 3,
    name: 'earned',
    sortable: true,
    label: 'Earned',
  },
  {
    id: 4,
    name: 'apr',
    sortable: true,
    label: 'APR',
  },
  {
    id: 5,
    name: 'liquidity',
    sortable: true,
    label: 'Liquidity',
  },
  {
    id: 6,
    name: 'multiplier',
    sortable: true,
    label: 'Multiplier',
  },
  {
    id: 7,
    name: 'details',
    sortable: true,
    label: '',
  },
]

export interface AprProps {
  value: string
  multiplier: string
  lpLabel: string
  tokenAddress?: Address
  quoteTokenAddress?: Address
  cakePrice: BigNumber
  originalValue: number
  hideButton?: boolean
}

export interface FarmWithStakedValue extends Farm {
  apr?: number
  liquidity?: BigNumber
}

export interface FarmProps {
  label: string
  pid: number
  image: string
}

export interface EarnedProps {
  earnings: number
  pid: number
}

export interface MultiplierProps {
  multiplier: string
}

export interface LiquidityProps {
  liquidity: BigNumber
}
