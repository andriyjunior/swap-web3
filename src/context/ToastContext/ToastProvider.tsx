import { IToast, toastTypes } from 'components/atoms/Toast/types'
import { kebabCase } from 'lodash'
import { createContext, useCallback, useState } from 'react'
import { ToastContextApi } from './types'

export const ToastsContext = createContext<ToastContextApi | undefined>(
  undefined
)

export const ToastsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastContextApi['toasts']>([])

  const toast = useCallback(
    ({ title, description, type }: Omit<IToast, 'id'>) => {
      setToasts((prevToasts) => {
        const id = kebabCase(title)

        // Remove any existing toasts with the same id
        const currentToasts = prevToasts.filter(
          (prevToast) => prevToast.id !== id
        )

        return [
          {
            id,
            title,
            description,
            type,
          },
          ...currentToasts,
        ]
      })
    },
    [setToasts]
  )

  const toastError = useCallback(
    (title: IToast['title'], description?: IToast['description']) => {
      return toast({ title, description, type: toastTypes.DANGER })
    },
    [toast]
  )

  const toastInfo = useCallback(
    (title: IToast['title'], description?: IToast['description']) => {
      return toast({ title, description, type: toastTypes.INFO })
    },
    [toast]
  )

  const toastSuccess = useCallback(
    (title: IToast['title'], description?: IToast['description']) => {
      return toast({ title, description, type: toastTypes.SUCCESS })
    },
    [toast]
  )

  const toastWarning = useCallback(
    (title: IToast['title'], description?: IToast['description']) => {
      return toast({ title, description, type: toastTypes.WARNING })
    },
    [toast]
  )

  const clear = useCallback(() => setToasts([]), [])
  const remove = useCallback((id: string) => {
    setToasts((prevToasts) =>
      prevToasts.filter((prevToast) => prevToast.id !== id)
    )
  }, [])

  return (
    <ToastsContext.Provider
      value={{
        toasts,
        clear,
        remove,
        toastError,
        toastInfo,
        toastSuccess,
        toastWarning,
      }}
    >
      {children}
    </ToastsContext.Provider>
  )
}
