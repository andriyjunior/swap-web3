import swap_icon from 'assets/icons/swap.svg'
import farms_icon from 'assets/icons/farms.svg'
import stake_icon from 'assets/icons/stake.svg'
import games_icon from 'assets/icons/games.svg'

export const baseMenu = [
  {
    id: 1,
    key: 'swap',
    icon: swap_icon,
    to: '/swap',
  },
  {
    id: 2,
    key: 'farms',
    icon: farms_icon,
    to: '/farms',
  },
  {
    id: 3,
    key: 'staking',
    icon: stake_icon,
    to: '/staking',
    soon: true,
  },
  {
    id: 4,
    key: 'games',
    icon: games_icon,
    to: '/games',
    soon: true,
  },
]
