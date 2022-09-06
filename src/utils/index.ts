export * from './isDev'
export * from './getTokenList'
export * from './uriToHttp'
export * from './sliceAccAddress'

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // $& means the whole matched string
}
