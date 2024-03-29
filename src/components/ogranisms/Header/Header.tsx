import { FC, memo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { breakpoints, colors, getTransparentColor, zIndexes } from 'styles'
import {
  Button,
  MenuToogle,
  Modal,
  UserBar,
  WalletConnection,
} from 'components'

import discord_icon from 'assets/socials/discord.svg'
import medium_icon from 'assets/socials/medium.svg'
import twitter_icon from 'assets/socials/twitter.svg'
import mediumOL_icon from 'assets/socials/medium-outlined.svg'
import twitterOL_icon from 'assets/socials/twitter-outlined.svg'
import discordOL_icon from 'assets/socials/discord-outlined.svg'
import wallet_icon from 'assets/icons/wallet.svg'
import { useActiveWeb3React, useMetamaskConnection, useModalRef } from 'hooks'
import { selectUser, useAppSelector } from 'store'
import { sliceAccAddress } from 'utils'

// interface IHeaderProps {}

const StyledRoot = styled.div`
  position: sticky;
  top: 0;
  padding: 0 28px;
  height: 78px;
  width: 100%;
  background-color: ${getTransparentColor(colors.white, 0.25)};
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(10px);
  z-index: ${zIndexes.fixed};

  @media (max-width: ${breakpoints.md}) {
    padding: 0 16px;
    justify-content: space-between;
  }
`

const StyledSocials = styled.div`
  display: flex;
  align-items: center;
  gap: 42px;

  @media (max-width: ${breakpoints.sm}) {
    gap: 12px;
  }
`

const StyledIcon = styled.a`
  transform: scale(1);
  transition: transform 0.1s ease-in;

  &:hover {
    transform: scale(1.1);
  }
`

const StyledRight = styled.div`
  /* width: 200px; */
  display: flex;
  justify-content: flex-end;
`

interface IHeader {
  isCollapsed: boolean
  handleCollapsedToogle: () => void
}

interface IconProps {
  src?: string
  srcOnHover: string
  alt?: string
}

const Icon: React.FC<IconProps> = ({ src, srcOnHover, alt }) => (
  <img
    src={src}
    alt={alt}
    onMouseOver={(e) => (e.currentTarget.src = srcOnHover)}
    onMouseOut={(e) => (e.currentTarget.src = src || '')}
  />
)

export const Header: FC<IHeader> = memo(
  ({ isCollapsed, handleCollapsedToogle }) => {
    const { t } = useTranslation()
    const { account } = useActiveWeb3React()
    const { disconnect } = useMetamaskConnection()

    // const currWallet = useAppSelector(
    //   selectCurrentWallet
    // ).connectedWallets.find((wallet) => wallet.account === account)

    const handleDisconnect = () => {
      disconnect()
    }

    const walletsRef = useModalRef()

    const handleOnClick = () => walletsRef.current?.open()
    const handleOnClose = () => walletsRef.current?.close()

    const username = sliceAccAddress(account)

    return (
      <>
        <Modal ref={walletsRef} title={t('walletConnection.connectToAWallet')}>
          <WalletConnection onClick={handleOnClose} />
        </Modal>
        <StyledRoot>
          <MenuToogle
            isCollapsed={isCollapsed}
            handleCollapsedToogle={handleCollapsedToogle}
          />
          <StyledSocials>
            <StyledIcon target="_blank" href={'https://discord.gg/PZD2BFkRAj'}>
              <Icon src={discord_icon} srcOnHover={discordOL_icon} />
            </StyledIcon>
            <StyledIcon
              target="_blank"
              href={'https://medium.com/@SevnFinance'}
            >
              <Icon src={medium_icon} srcOnHover={mediumOL_icon} />
            </StyledIcon>
            <StyledIcon
              target="_blank"
              href={'https://twitter.com/SevnFinance'}
            >
              <Icon src={twitter_icon} srcOnHover={twitterOL_icon} />
            </StyledIcon>
          </StyledSocials>
          <StyledRight>
            {account && (
              <UserBar username={username} disconnect={handleDisconnect} />
            )}
            {!account && (
              <Button
                onClick={handleOnClick}
                title={t('connectWallet')}
                icon={wallet_icon}
              />
            )}
          </StyledRight>
        </StyledRoot>
      </>
    )
  }
)
