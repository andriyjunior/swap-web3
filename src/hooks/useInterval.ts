import { useEffect, useRef, useState, useCallback } from 'react'
import { isUndefinedOrNull } from 'utils'
import { useLastUpdated } from 'packages/hooks'

export const useInterval = (
  callback: () => void,
  delay: null | number,
  leading = true,
  initiateUpdate = true
) => {
  const [runImmediate, setRunImmediate] = useState(leading)
  const [runAfter, setRunAfter] = useState(delay)
  const savedCallback = useRef<() => void>(callback)
  const [isReadyForUpdate, setIsReadyForUpdate] = useState(false)
  const { lastUpdated, setLastUpdated: refresh } = useLastUpdated()

  // Use props indirectly to not render set up timeout effect twice if both props changed.
  useEffect(() => {
    setRunImmediate(leading)
    setRunAfter(delay)
  }, [leading, delay])

  const tick = useCallback(() => {
    setIsReadyForUpdate(true)
  }, [])

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    if (initiateUpdate && isReadyForUpdate) {
      savedCallback.current?.()
      setIsReadyForUpdate(false)
      setRunImmediate(false)
      refresh()
    }
  }, [initiateUpdate, isReadyForUpdate, refresh])

  // Set up the timeout.
  useEffect(() => {
    if (!isUndefinedOrNull(runAfter)) {
      if (runImmediate) tick()
      else if (runAfter) {
        const id = setTimeout(tick, runAfter)
        return () => {
          setIsReadyForUpdate(false)
          clearTimeout(id)
        }
      }
    }
    return () => setIsReadyForUpdate(false)
  }, [runAfter, runImmediate, lastUpdated, tick])
}
