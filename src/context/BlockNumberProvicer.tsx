import { useActiveWeb3React } from 'hooks'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const MISSING_PROVIDER = Symbol()
const BlockNumberContext = createContext<
  | {
      value?: number
    }
  | typeof MISSING_PROVIDER
>(MISSING_PROVIDER)

const useBlockNumberContext = () => {
  const blockNumber = useContext(BlockNumberContext)
  if (blockNumber === MISSING_PROVIDER) {
    throw new Error(
      'BlockNumber hooks must be wrapped in a <BlockNumberProvider>'
    )
  }
  return blockNumber
}

export const useBlockNumber = (): number | undefined => {
  return useBlockNumberContext().value
}

export const BlockNumberProvider = ({ children }: { children: ReactNode }) => {
  const { library, chainId: activeChainId } = useActiveWeb3React()
  const [{ chainId, block }, setChainBlock] = useState<{
    chainId?: number
    block?: number
  }>({ chainId: activeChainId })

  const onBlock = useCallback(
    (newBlock: number) => {
      setChainBlock((chainBlock) => {
        if (chainBlock.chainId === activeChainId) {
          if (!chainBlock.block || chainBlock.block < newBlock) {
            return { chainId: activeChainId, block: newBlock }
          }
        }
        return chainBlock
      })
    },
    [activeChainId]
  )

  useEffect(() => {
    let stale = false

    if (library && activeChainId) {
      setChainBlock((chainBlock) =>
        chainBlock.chainId === activeChainId
          ? chainBlock
          : { chainId: activeChainId }
      )

      library
        .getBlockNumber()
        .then((newBlock) => {
          if (!stale) onBlock(newBlock)
        })
        .catch((error) =>
          console.error(
            `Failed to get block number for chainId ${activeChainId}`,
            error
          )
        )

      library.on('block', onBlock)

      return () => {
        stale = true
        library.removeListener('block', onBlock)
      }
    }
  }, [activeChainId, library, onBlock])

  const value = useMemo(
    () => ({
      value: chainId === activeChainId ? block : undefined,
    }),
    [activeChainId, block, chainId]
  )

  return (
    <BlockNumberContext.Provider value={value}>
      {children}
    </BlockNumberContext.Provider>
  )
}
