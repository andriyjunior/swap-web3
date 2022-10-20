import { ToastsContext } from 'context'
import { useContext } from 'react'

export const useToast = () => {
  const toastContext = useContext(ToastsContext)

  if (toastContext === undefined) {
    throw new Error('Toasts context undefined')
  }

  return toastContext
}
