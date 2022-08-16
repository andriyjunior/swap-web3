import { Dispatch, FC, SetStateAction } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { t } from 'i18next'
import { colors, getTransparentColor, zIndexes } from 'styles'
import { Button, MenuToogle } from 'components'

import telegram_icon from 'assets/socials/telegram.svg'
import medium_icon from 'assets/socials/medium.svg'
import twitter_icon from 'assets/socials/twitter.svg'
import wallet_icon from 'assets/icons/wallet.svg'
import mediumOL_icon from 'assets/socials/medium-outlined.svg'
import twitterOL_icon from 'assets/socials/twitter-outlined.svg'
import telegramOL_icon from 'assets/socials/telegram-outlined.svg'

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

export const Header: FC<IHeader> = ({ isCollapsed, handleCollapsedToogle }) => {
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

      <StyledRight>
        <Button
          onClick={() => console.log('click')}
          title={t('connectWallet')}
          icon={wallet_icon}
        />
      </StyledRight>
    </StyledRoot>
  )
}
