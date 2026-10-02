import { X } from 'lucide-react'
import { useEffect, useRef, type ReactNode } from 'react'

type DialogProps = {
  title: string
  description?: ReactNode
  variant?: 'modal' | 'drawer'
  onClose: () => void
  footer?: ReactNode
  children: ReactNode
}

/** Native <dialog> shown modally while mounted: focus trap, Esc to close and inert background come for free. */
export function Dialog({ title, description, variant = 'modal', onClose, footer, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    dialog.showModal()
    const handleCancel = (event: Event) => {
      event.preventDefault()
      onCloseRef.current()
    }
    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
      if (dialog.open) dialog.close()
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={`adm-lw-dialog adm-lw-dialog--${variant}`}
      aria-label={title}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      <div className="adm-lw-dialog-panel">
        <header className="adm-lw-dialog-head">
          <div>
            <h2 className="adm-section-title">{title}</h2>
            {description ? <div className="adm-section-desc">{description}</div> : null}
          </div>
          <button type="button" className="adm-icon-btn" onClick={onClose} aria-label="Close">
            <X size={16} aria-hidden />
          </button>
        </header>
        <div className="adm-lw-dialog-body">{children}</div>
        {footer ? <footer className="adm-lw-dialog-foot">{footer}</footer> : null}
      </div>
    </dialog>
  )
}
