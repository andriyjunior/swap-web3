import { serializeToken } from 'store/features/user/hooks/helpers'

export function serializeTokens(unserializedTokens) {
  const serializedTokens = Object.keys(unserializedTokens).reduce(
    (accum, key) => {
      return { ...accum, [key]: serializeToken(unserializedTokens[key]) }
    },
    {} as any
  )

  return serializedTokens
}
