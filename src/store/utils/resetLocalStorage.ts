const VERSION_KEY = '_persist:root:version'
const PERSIST_PREFIX = 'persist:'

export const resetLocalStorage = (
  currentVersion: number,
  persistKey = 'root'
) => {
  const savedVersion = parseFloat(localStorage.getItem(VERSION_KEY) || '')

  if (savedVersion !== currentVersion) {
    localStorage.removeItem(`${PERSIST_PREFIX}${persistKey}`)
    localStorage.setItem(VERSION_KEY, currentVersion.toString())
  }
}
