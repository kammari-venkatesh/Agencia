import { X } from 'lucide-react'
import { useId, useState, type KeyboardEvent } from 'react'

type TagEditorProps = {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  max: number
  maxLength: number
  label?: string
}

const normalizeTag = (raw: string) => raw.trim().replace(/\s+/g, ' ').toLowerCase()

/** Free-text tags; stored lowercase to match the server's normalisation. */
export function TagEditor({ value, onChange, suggestions = [], max, maxLength, label = 'Tags' }: TagEditorProps) {
  const [draft, setDraft] = useState('')
  const id = useId()
  const full = value.length >= max

  const add = (raw: string) => {
    const tag = normalizeTag(raw).slice(0, maxLength)
    if (tag && !value.includes(tag) && !full) onChange([...value, tag])
    setDraft('')
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add(draft)
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const open = suggestions.filter((tag) => !value.includes(tag) && tag.includes(normalizeTag(draft))).slice(0, 8)

  return (
    <div className="adm-field">
      <label className="adm-field-label" htmlFor={id}>
        {label.toUpperCase()}
      </label>
      <div className="adm-input-wrap adm-chip-input">
        {value.map((tag) => (
          <span key={tag} className="adm-chip">
            {tag}
            <button
              type="button"
              className="adm-chip-remove"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              aria-label={`Remove tag ${tag}`}
            >
              <X size={12} aria-hidden />
            </button>
          </span>
        ))}
        <input
          id={id}
          className="adm-input"
          value={draft}
          maxLength={maxLength}
          disabled={full}
          placeholder={full ? `Up to ${max} tags` : 'Type a tag and press Enter'}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onBlur={() => draft.trim() && add(draft)}
        />
      </div>
      {open.length > 0 && !full ? (
        <div className="adm-chip-suggestions">
          {open.map((tag) => (
            <button key={tag} type="button" className="adm-chip-suggestion" onClick={() => add(tag)}>
              + {tag}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
