import { FC } from 'react'
import { StyledRoot, StyledText } from './styled'

interface ITabProps {
  title: string
  to: string
  isActive: boolean
  isLast?: boolean
  onClick: () => void
}

export const Tab: FC<ITabProps> = ({ title, to, isActive, onClick }) => {
  return (
    <StyledRoot
      to={to}
      onClick={onClick}
      isActive={isActive}
      className={isActive ? 'active' : ''}
      replace
    >
      <StyledText>{title}</StyledText>
    </StyledRoot>
  )
}
