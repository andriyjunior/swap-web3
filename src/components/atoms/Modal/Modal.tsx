import { useLockedBody } from 'hooks'
import { createPortal } from 'react-dom'
import {
  ElementRef,
  forwardRef,
  ForwardRefRenderFunction,
  ReactNode,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react'
import { ModalLayout } from './parts/ModalLayout'

interface IModalRefProps {
  open: () => void
  close: () => void
  isOpened?: boolean
}

interface IModalProps {
  children: ReactNode
  title?: string
  withoutOverlay?: boolean
  onClose?: () => void
}

const ModalComponent: ForwardRefRenderFunction<IModalRefProps, IModalProps> = (
  { children, title, withoutOverlay, onClose },
  forwardedRef
) => {
  const [isShown, setShown] = useState(false)
  const [, setLocked] = useLockedBody()

  useEffect(() => {
    if (isShown) {
      setLocked(true)
    } else {
      setLocked(false)
    }
  }, [isShown])

  const handleOpen = useCallback(() => setShown(true), [])
  const handleClose = useCallback(() => {
    setShown(false)
    if (onClose) {
      onClose()
    }
  }, [onClose])

  useImperativeHandle(forwardedRef, () => ({
    open: handleOpen,
    close: handleClose,
    isOpened: isShown,
  }))

  return createPortal(
    <ModalLayout
      isShown={isShown}
      handleClose={handleClose}
      title={title}
      withoutOverlay={withoutOverlay}
    >
      {children}
    </ModalLayout>,
    document.getElementById('modal') as HTMLElement
  )
}

export type TModal = ElementRef<typeof Modal>

export const Modal = forwardRef(ModalComponent)
