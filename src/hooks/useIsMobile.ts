import { useEffect, useState } from 'react'
import { breakpoints } from 'styles'

export const useIsMobile = () => {
  const [isMobile, setMobile] = useState(false)

  useEffect(() => {
    const checking = () => {
      if (window.outerWidth < parseInt(breakpoints.md)) {
        setMobile(true)
      } else {
        setMobile(false)
      }
    }

    window.addEventListener('resize', checking)

    return () => {
      window.removeEventListener('resize', checking)
    }
  }, [])
  return isMobile
}
