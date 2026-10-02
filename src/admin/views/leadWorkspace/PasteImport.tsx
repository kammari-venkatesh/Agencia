import { ClipboardPaste } from 'lucide-react'
import { useId } from 'react'

type PasteImportProps = {
  value: string
  maxLength: number
  onChange: (value: string) => void
}

export function PasteImport({ value, maxLength, onChange }: PasteImportProps) {
  const id = useId()
  const lines = value ? value.split(/\r\n|\r|\n/).filter((line) => line.trim()).length : 0
  const tooLarge = value.length > maxLength

  return (
    <div className="adm-field">
      <label className="adm-field-label" htmlFor={id}>
        <ClipboardPaste size={12} aria-hidden /> PASTE ROWS FROM GOOGLE SHEETS OR EXCEL
      </label>
      <textarea
        id={id}
        className="adm-lw-textarea adm-lw-paste"
        rows={12}
        value={value}
        spellCheck={false}
        placeholder={'Business Name\tPhone\tWebsite\tCity\nSunrise Dental\t+91 98765 43210\tsunrisedental.in\tPune'}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
      />
      <span className={`adm-field-hint ${tooLarge ? 'adm-field-error' : ''}`}>
        {lines.toLocaleString()} non-empty {lines === 1 ? 'line' : 'lines'} · {value.length.toLocaleString()} /{' '}
        {maxLength.toLocaleString()} characters. Copy the cells including the header row; tabs and commas are both
        detected.
      </span>
    </div>
  )
}
