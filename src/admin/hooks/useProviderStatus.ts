import { useEffect, useState } from 'react'
import { getProviderStatus, type ProviderStatus } from '../api/leadFinder'

// Shared across components and page navigations; the provider only changes on a server restart.
let cached: ProviderStatus | null = null
let pending: Promise<ProviderStatus | null> | null = null

const loadProviderStatus = () => {
  pending ??= getProviderStatus()
    .then((res) => (cached = res.data))
    .catch(() => {
      pending = null
      return null
    })
  return pending
}

/** Lead Finder provider status, or null while loading or if it cannot be fetched (treated as test mode). */
export function useProviderStatus() {
  const [status, setStatus] = useState<ProviderStatus | null>(cached)

  useEffect(() => {
    if (cached) return
    let active = true
    loadProviderStatus().then((result) => {
      if (active && result) setStatus(result)
    })
    return () => {
      active = false
    }
  }, [])

  return status
}
