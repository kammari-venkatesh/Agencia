import { LoaderCircle, TriangleAlert } from 'lucide-react'

type AdminStateScreenProps =
  | { kind: 'loading'; message?: string }
  | { kind: 'error'; message: string; onRetry: () => void }

export function AdminStateScreen(props: AdminStateScreenProps) {
  return (
    <div className="adm-state-screen" role={props.kind === 'error' ? 'alert' : 'status'}>
      {props.kind === 'loading' ? (
        <>
          <LoaderCircle size={28} className="adm-spin" aria-hidden />
          <span>{props.message ?? 'Checking your session…'}</span>
        </>
      ) : (
        <>
          <TriangleAlert size={28} aria-hidden />
          <span>{props.message}</span>
          <button type="button" className="adm-btn adm-btn--primary" onClick={props.onRetry}>
            Try again
          </button>
        </>
      )}
    </div>
  )
}
