import { ToastsContainer } from 'components'
import { useToast } from 'hooks'
import { useCallback } from 'react'

export const ToastListener = () => {
  const { toasts, remove } = useToast()

  const handleRemove = useCallback((id: string) => remove(id), [remove])

  return <ToastsContainer toasts={toasts} onRemove={handleRemove} />
}
