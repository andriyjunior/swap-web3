import { Typography, IconButton } from 'components'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, FC } from 'react'
import styled from 'styled-components'
import {
  zIndexes,
  getTransparentColor,
  colors,
  borderRadius,
  breakpoints,
} from 'styles'

interface IModalLayoutProps {
  children: ReactNode
  isShown: boolean
  handleClose: () => void
  title?: string
  withoutOverlay?: boolean
}

const StyledRoot = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${zIndexes.modal};

  @media (max-width: ${breakpoints.md}) {
    padding: 16px;
  }
`

const StyledOverlay = styled(motion.div)<{ withoutOverlay?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ withoutOverlay }) =>
    !withoutOverlay ? getTransparentColor(colors.black, 0.5) : 'none'};
  cursor: pointer;
  z-index: -1;
`

const StyledModal = styled(motion.div)`
  padding: 20px 16px;
  position: relative;
  width: 502px;
  border-radius: ${borderRadius.primary};
  background-color: ${colors.white};

  @media (max-width: ${breakpoints.md}) {
    width: 100%;
  }
`

const StyledContent = styled.div`
  padding-top: 16px;
`

const StyledCloser = styled.span`
  position: absolute;
  right: 16px;
  top: 24px;
`

export const ModalLayout: FC<IModalLayoutProps> = ({
  isShown,
  handleClose,
  title,
  children,
  withoutOverlay,
}) => {
  return (
    <AnimatePresence>
      {isShown && (
        <StyledRoot>
          <StyledOverlay
            onClick={handleClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            withoutOverlay={withoutOverlay}
          />
          <StyledModal
            initial={{ opacity: 0, y: -20, scale: 0 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {title && <Typography.Header4>{title}</Typography.Header4>}
            <StyledCloser>
              <IconButton icon={'cross'} onClick={handleClose} />
            </StyledCloser>

            <StyledContent>{children}</StyledContent>
          </StyledModal>
        </StyledRoot>
      )}
    </AnimatePresence>
  )
}
