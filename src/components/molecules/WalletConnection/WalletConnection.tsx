import { FC, useEffect, useState } from 'react'
import { useMetamaskConnection } from 'hooks'
import { Flex, Wallet } from 'components'

import metamask_icon from 'assets/wallets/metamask.png'
import { useAppDispatch } from 'store'
import { useWeb3React } from '@web3-react/core'

interface IWalletConnection {
  onClick: () => void
}

export const WalletConnection: FC<IWalletConnection> = ({ onClick }) => {
  const { connector, account, chainId } = useWeb3React()
  const [lastActiveWalletAddress, setLastActiveWalletAddress] = useState<
    string | undefined | null
  >(account)

  const { connect } = useMetamaskConnection()

  // const [connectedWallets, addWalletToConnectedWallets] = useConnectedWallets()
  const walletType = 'MetaMask'

  const handleOnClick = () => {
    connect()
    onClick()
  }

  // useEffect(() => {
  //   if (account && lastActiveWalletAddress !== account) {
  //     addWalletToConnectedWallets({ account, walletType })
  //   }
  //   setLastActiveWalletAddress(account)
  // }, [connectedWallets, lastActiveWalletAddress, account, connector, chainId])

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
