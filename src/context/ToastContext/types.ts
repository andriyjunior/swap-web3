import { IToast } from 'components'

type ToastSignature = (
  title: IToast['title'],
  description?: IToast['description']
) => void
export interface ToastContextApi {
  toasts: IToast[]
  clear: () => void
  remove: (id: string) => void
  toastError: ToastSignature
  toastInfo: ToastSignature
  toastSuccess: ToastSignature
  toastWarning: ToastSignature
}
