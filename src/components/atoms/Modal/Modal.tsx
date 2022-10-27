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
}

interface IModalProps {
  children: ReactNode
  title?: string
  withoutOverlay?: boolean
}

const ModalComponent: ForwardRefRenderFunction<IModalRefProps, IModalProps> = (
  { children, title, withoutOverlay },
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
  const handleClose = useCallback(() => setShown(false), [])

  useImperativeHandle(forwardedRef, () => ({
    open: handleOpen,
    close: handleClose,
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
