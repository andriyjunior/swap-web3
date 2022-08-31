import { TModal } from 'components'
import { useRef } from 'react'

export const useModalRef = () => {
  return useRef<TModal>(null)
}
