import { FC, useEffect, useState } from 'react'
import { Player } from '@lottiefiles/react-lottie-player'

import logo from 'assets/anim-logo.json'
import styled from 'styled-components'
import { gradients, zIndexes } from 'styles'
import { AnimatePresence, motion } from 'framer-motion'

// interface ILoaderProps {}

const StyledRoot = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  background: ${gradients.bg};
  background-blend-mode: normal, luminosity, normal, normal;
  height: 100vh;
  width: 100vw;
  z-index: ${zIndexes.fixed};
`

const StyledLogo = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

const StyledProgressBar = styled.div<{ width: number }>`
  box-sizing: content-box;
  position: absolute;
  content: '';
  width: ${({ width }) => width + '%'};
  height: 10px;
  background: ${gradients.primary};
  border-bottom: 5px solid #ffffff;
  top: 0;
  left: 0;
  transition: width 0.2s ease-in;
`

export const Loader: FC = () => {
  const [percents, setPercents] = useState(0)
  const [isLoaded, setLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setPercents(100), 500)

    if (percents === 100) {
      setTimeout(() => setLoaded(true), 200)
    }

    return () => clearTimeout(timer)
  }, [percents])

  return (
    <AnimatePresence initial>
      {!isLoaded && (
        <StyledRoot
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <StyledProgressBar width={percents} />
          <StyledLogo>
            <Player
              autoplay
              loop
              src={logo}
              style={{ height: '150px', width: '150px' }}
            />
          </StyledLogo>
        </StyledRoot>
      )}
    </AnimatePresence>
  )
}
