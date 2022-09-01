import { AnimatePresence, motion } from 'framer-motion'
import { FC, useRef, useState } from 'react'
import styled from 'styled-components'

import { borderRadius, colors } from 'styles'
import { DropdownItem, Typography } from 'components/atoms'
import { useOnClickOutside } from 'hooks'

import arrow_icon from 'assets/icons/arrow.svg'

type Option = {
  key: number | number
  value: string
}

interface IDropdown {
  title: string
  options: Option[]
  onSelect: (value: Option) => void
}

const StyledRoot = styled.div`
  width: 140px;
  background-color: ${colors.white};
  border: none;
  border-radius: ${borderRadius.primary};
  overflow: hidden;
`

const StyledButton = styled.button`
  width: 100%;
  height: 44px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: transparent;
  border: none;
  border-radius: ${borderRadius.primary};
`

const StyledIcon = styled.img<{ isOpen: boolean }>`
  width: 24px;
  height: 24px;
  transform: rotate(${({ isOpen }) => (isOpen ? '180deg' : '0deg')});
  transition: transform 0.1s ease-in;
`

export const Dropdown: FC<IDropdown> = ({ options, title, onSelect }) => {
  const [isOpen, setOpen] = useState(false)

  const containerRef = useRef(null)
  const handleToogle = () => setOpen((prev) => !prev)
  const handleClose = () => setOpen(false)

  useOnClickOutside(containerRef, handleClose, 'mousedown')

  const handleOnClick = (key) => {
    handleClose()
    onSelect(key)
  }

  return (
    <StyledRoot ref={containerRef}>
      <StyledButton onClick={handleToogle}>
        <Typography.Body>{title}</Typography.Body>
        <StyledIcon src={arrow_icon} isOpen={isOpen} />
      </StyledButton>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: 'inherit', opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((option) => {
              return (
                <DropdownItem
                  key={option.key}
                  onClick={() => handleOnClick(option)}
                >
                  {option.value}
                </DropdownItem>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </StyledRoot>
  )
}
