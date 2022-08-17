import { FC, memo } from 'react'
import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, getTransparentColor, zIndexes } from 'styles'
import { Button, MenuToogle, UserBar } from 'components'

import telegram_icon from 'assets/socials/telegram.svg'
import medium_icon from 'assets/socials/medium.svg'
import twitter_icon from 'assets/socials/twitter.svg'
import mediumOL_icon from 'assets/socials/medium-outlined.svg'
import twitterOL_icon from 'assets/socials/twitter-outlined.svg'
import telegramOL_icon from 'assets/socials/telegram-outlined.svg'
import wallet_icon from 'assets/icons/wallet.svg'
import { useMetaMask } from 'hooks'
import { selectUser, useAppSelector } from 'store'

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
`

const StyledSocials = styled.div`
  display: flex;
  align-items: center;
  gap: 42px;
`

const StyledIcon = styled(NavLink)`
  transform: scale(1);
  transition: transform 0.1s ease-in;

  &:hover {
    transform: scale(1.1);
  }
`

const StyledRight = styled.div`
  width: 200px;
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
    const { accountAddress } = useAppSelector(selectUser)
    const { connect, disconnect } = useMetaMask()

    const username =
      accountAddress.slice(0, 2) + '...' + accountAddress.slice(38)

    return (
      <StyledRoot>
        <MenuToogle
          isCollapsed={isCollapsed}
          handleCollapsedToogle={handleCollapsedToogle}
        />
        <StyledSocials>
          <StyledIcon to={'#'}>
            <Icon src={telegram_icon} srcOnHover={telegramOL_icon} />
          </StyledIcon>
          <StyledIcon to={'#'}>
            <Icon src={medium_icon} srcOnHover={mediumOL_icon} />
          </StyledIcon>
          <StyledIcon to={'#'}>
            <Icon src={twitter_icon} srcOnHover={twitterOL_icon} />
          </StyledIcon>
        </StyledSocials>
        {/* "0x...3C73" */}
        <StyledRight>
          {accountAddress && (
            <UserBar username={username} disconnect={disconnect} />
          )}
          {!accountAddress && (
            <Button
              onClick={connect}
              title={t('connectWallet')}
              icon={wallet_icon}
            />
          )}
        </StyledRight>
      </StyledRoot>
    )
  }
)
