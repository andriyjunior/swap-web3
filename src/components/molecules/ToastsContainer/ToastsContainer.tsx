import { Toast } from 'components'
import { IToast } from 'components/atoms/Toast/types'
import { motion } from 'framer-motion'
import { FC } from 'react'
import styled from 'styled-components'
import { zIndexes } from 'styles'

const ZINDEX = zIndexes.dropdown
const TOP_POSITION = 80 // Initial position from the top

export interface IToastsContainerProps {
  toasts: IToast[]
  stackSpacing?: number
  ttl?: number
  onRemove: (id: string) => void
}

const StyledContained = styled(motion.div)`
  position: fixed;
  right: 16px;
  top: ${TOP_POSITION}px;
  z-index: ${zIndexes.tooltip};
`

export const ToastsContainer: FC<IToastsContainerProps> = ({
  toasts,
  onRemove,
  ttl = 6000,
  stackSpacing = 24,
}) => {
  return (
    <div>
      <StyledContained>
        {toasts.map((toast, idx) => {
          const zIndex = (ZINDEX - idx).toString()

          return (
            <Toast
              key={toast.id}
              toast={toast}
              onRemove={onRemove}
              ttl={ttl}
              style={{
                zIndex,
              }}
            />
          )
        })}
      </StyledContained>
    </div>
  )
}
