import { useEffect, useRef } from 'react'

/**
 * Runs `task` every `intervalMs` while `enabled`, waiting for each run to finish
 * before scheduling the next. Pauses while the tab is hidden and runs immediately
 * when it becomes visible again.
 */
export function usePolling(task: (signal: AbortSignal) => Promise<unknown>, enabled: boolean, intervalMs: number) {
  const taskRef = useRef(task)
  useEffect(() => {
    taskRef.current = task
  })

  useEffect(() => {
    if (!enabled) return
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    let inFlight = false

    const run = async () => {
      if (document.hidden || inFlight) return
      inFlight = true
      try {
        await taskRef.current(controller.signal)
      } catch {
        // The task reports its own errors; keep polling.
      } finally {
        inFlight = false
      }
      if (!controller.signal.aborted) timer = setTimeout(run, intervalMs)
    }

    const onVisibilityChange = () => {
      if (document.hidden) return
      clearTimeout(timer)
      void run()
    }

    timer = setTimeout(run, intervalMs)
    document.addEventListener('visibilitychange', onVisibilityChange)
    return () => {
      controller.abort()
      clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    }
  }, [enabled, intervalMs])
}
