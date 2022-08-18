import { FC, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ProfileButton, Typography } from 'components'
import { useTranslation } from 'react-i18next'
import { StyledRoot, StyledAvatarWrap, StyledProfileButtons } from './styled'

import logout_icon from 'assets/icons/logout.svg'

interface IUserBarProps {
  username: string
  disconnect: () => void
}

export const UserBar: FC<IUserBarProps> = ({ username, disconnect }) => {
  const { t } = useTranslation()
  const [isOpened, setOpened] = useState(false)

  const handleClose = () => {
    setOpened(false)
  }

  const handleOpen = () => {
    setOpened(true)
  }

  return (
    <StyledRoot
      isOpened={isOpened}
      onClick={handleOpen}
      onMouseOver={handleOpen}
      onMouseLeave={handleClose}
    >
      <Typography.ButtonBold> {username}</Typography.ButtonBold>
      <StyledAvatarWrap></StyledAvatarWrap>
      <AnimatePresence>
        {isOpened && (
          <StyledProfileButtons
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'inherit', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <ProfileButton onClick={() => {}}>
              {t('userBar.wallet')}
            </ProfileButton>
            <ProfileButton onClick={() => {}}>
              {t('userBar.transactions')}
            </ProfileButton>
            <ProfileButton onClick={() => {}}>
              {t('userBar.dashboard')}
            </ProfileButton>
            <ProfileButton onClick={disconnect} icon={logout_icon}>
              {t('userBar.disconnect')}
            </ProfileButton>
          </StyledProfileButtons>
        )}
      </AnimatePresence>
    </StyledRoot>
  )
}
