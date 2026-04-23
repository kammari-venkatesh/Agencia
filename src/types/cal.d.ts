export {}

declare global {
  interface Window {
    Cal?: (...args: unknown[]) => void
  }
}
