import { FC, ReactNode, useState } from 'react'

import arrowDown_icon from 'assets/icons/arrow.svg'
import styled from 'styled-components'
import { AnimatePresence, motion } from 'framer-motion'

const StyledRoot = styled.div`
  padding: 8px 0;
`

const StyledButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border: none;
`

const StyledIcon = styled.img<{ isActive?: boolean }>`
  transition: transform 0.2s ease-in;
  transform: rotateZ(${({ isActive }) => (isActive ? 180 : 0)}deg);
`

const StyledContent = styled(motion.div)``

interface IDropdownProps {
  element: ReactNode
  children: ReactNode
  hasArrow?: boolean
}

export const Dropdown: FC<IDropdownProps> = ({
  element,
  children,
  hasArrow,
}) => {
  const [isShown, setShown] = useState(false)

  // const handleOpen = () => setShown(true)
  // const handleClose = () => setShown(false)
  const handleToogle = () => setShown((prev) => !prev)

  return (
    <StyledRoot>
      <StyledButton onClick={handleToogle}>
        {element}
        {hasArrow && <StyledIcon src={arrowDown_icon} isActive={isShown} />}
      </StyledButton>
      <AnimatePresence>
        {isShown && (
          <StyledContent
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'initial' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </StyledContent>
        )}
      </AnimatePresence>
    </StyledRoot>
  )
}
