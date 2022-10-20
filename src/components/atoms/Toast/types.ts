import { IToastsContainerProps } from 'components/molecules'
import { ReactNode } from 'react'
import { CSSProperties } from 'styled-components'

export const toastTypes = {
  SUCCESS: 'success',
  DANGER: 'danger',
  WARNING: 'warning',
  INFO: 'info',
}

export type Types = typeof toastTypes[keyof typeof toastTypes]

export interface IToast {
  id: string
  type: Types
  title: string
  description?: ReactNode
}

export interface IToastProps {
  toast: IToast
  onRemove: IToastsContainerProps['onRemove']
  ttl: number
  style: Partial<CSSProperties>
}
