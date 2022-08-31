import { FC } from 'react'
import { useMetaMask } from 'hooks'
import { Flex, Wallet } from 'components'

import metamask_icon from 'assets/wallets/metamask.png'

interface IWalletConnection {
  onClick: () => void
}

export const WalletConnection: FC<IWalletConnection> = ({ onClick }) => {
  const { connect } = useMetaMask()

  const handleOnClick = () => {
    connect()
    onClick()
  }

  return (
    <>
      <Flex>
        <Wallet
          onClick={handleOnClick}
          icon={metamask_icon}
          title={'Metamask'}
        />
      </Flex>
    </>
  )
}
