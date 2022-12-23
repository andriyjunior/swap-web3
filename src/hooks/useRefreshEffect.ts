import { FAST_INTERVAL, SLOW_INTERVAL } from 'config/constants'
import { DependencyList, EffectCallback, useEffect } from 'react'
import { useActiveWeb3React } from './useActiveWeb3React'

type BlockEffectCallback = (blockNumber: number) => ReturnType<EffectCallback>

const EMPTY_ARRAY = []

function useInterval(effect, interval) {
  useEffect(() => {
    effect()

    const timer = setInterval(() => {
      effect()
    }, interval)

    return () => {
      clearInterval(timer)
    }
  }, [])
}

export function useFastRefreshEffect(effect: any, deps?: DependencyList) {
  useInterval(effect, FAST_INTERVAL)
}

export function useSlowRefreshEffect(effect: any, deps?: DependencyList) {
  useInterval(effect, SLOW_INTERVAL)
}
