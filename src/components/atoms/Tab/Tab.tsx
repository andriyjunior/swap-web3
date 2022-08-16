import { FC } from 'react'
import { StyledRoot, StyledText } from './styled'

interface ITabProps {
  title: string
  isActive: boolean
  isLast?: boolean
  onClick: () => void
}

export const Tab: FC<ITabProps> = ({ title, isActive, onClick }) => {
  return (
    <StyledRoot
      onClick={onClick}
      isActive={isActive}
      className={isActive ? 'active' : ''}
    >
      <StyledText>{title}</StyledText>
    </StyledRoot>
  )
}
