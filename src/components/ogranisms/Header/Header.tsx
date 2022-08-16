import { Dispatch, FC, SetStateAction } from 'react'
import styled from 'styled-components'
import { colors, getTransparentColor } from 'styles'
import { Button } from 'components'

import telegram_icon from 'assets/socials/telegram.svg'
import medium_icon from 'assets/socials/medium.svg'
import twitter_icon from 'assets/socials/twitter.svg'
import { NavLink } from 'react-router-dom'
import { t } from 'i18next'
import { MenuToogle } from 'components/atoms/MenuToogle'

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

export const Header: FC<IHeader> = ({ isCollapsed, handleCollapsedToogle }) => {
  return (
    <StyledRoot>
      <MenuToogle
        isCollapsed={isCollapsed}
        handleCollapsedToogle={handleCollapsedToogle}
      />
      <StyledSocials>
        <StyledIcon to={'#'}>
          <img src={telegram_icon} alt="" />
        </StyledIcon>
        <StyledIcon to={'#'}>
          <img src={medium_icon} alt="" />
        </StyledIcon>
        <StyledIcon to={'#'}>
          <img src={twitter_icon} alt="" />
        </StyledIcon>
      </StyledSocials>

      <StyledRight>
        <Button
          onClick={() => console.log('click')}
          title={t('connectWallet')}
        />
      </StyledRight>
    </StyledRoot>
  )
}
