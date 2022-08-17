import { FC, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ProfileButton, Typography } from 'components'
import { useTranslation } from 'react-i18next'
import { useOnClickOutside } from 'hooks'
import { StyledRoot, StyledAvatarWrap, StyledProfileButtons } from './styled'

import logout_icon from 'assets/icons/logout.svg'

interface IUserBarProps {
  username: string
}

export const UserBar: FC<IUserBarProps> = ({ username }) => {
  const { t } = useTranslation()
  const [isOpened, setOpened] = useState(false)

  const ref = useRef(null)

  useOnClickOutside(ref, () => setOpened(false))

  const handleOpen = () => {
    setOpened((prev) => !prev)
  }

  return (
    <StyledRoot ref={ref} isOpened={isOpened} onClick={handleOpen}>
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
            <ProfileButton onClick={() => {}} icon={logout_icon}>
              {t('userBar.disconnect')}
            </ProfileButton>
          </StyledProfileButtons>
        )}
      </AnimatePresence>
    </StyledRoot>
  )
}
