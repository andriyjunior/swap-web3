import MulticallUpdater from 'store/features/multicall/updater'
import { Updater } from 'store/features/transactions/updater'

export const Updaters = () => {
  return (
    <div>
      <Updater />
      <MulticallUpdater />
    </div>
  )
}
