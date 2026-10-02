import { FileSpreadsheet, FileUp } from 'lucide-react'
import { useId, useState, type DragEvent } from 'react'

const ACCEPTED = /\.(csv|tsv|txt)$/i

type CsvImportProps = {
  file: { name: string; size: number } | null
  maxBytes: number
  onLoaded: (file: { name: string; size: number; content: string }) => void
}

export function CsvImport({ file, maxBytes, onLoaded }: CsvImportProps) {
  const id = useId()
  const [error, setError] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)

  const read = async (picked: File | undefined) => {
    if (!picked) return
    setError(null)
    if (!ACCEPTED.test(picked.name)) {
      setError('Choose a .csv, .tsv or .txt file. For Excel files, use "Save as CSV" first.')
      return
    }
    if (picked.size > maxBytes) {
      setError(`That file is ${(picked.size / 1_000_000).toFixed(1)} MB; the limit is ${maxBytes / 1_000_000} MB.`)
      return
    }
    try {
      const content = (await picked.text()).replace(/^\uFEFF/, '')
      if (!content.trim()) {
        setError('That file is empty.')
        return
      }
      onLoaded({ name: picked.name, size: picked.size, content })
    } catch {
      setError('Could not read that file.')
    }
  }

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setDragging(false)
    void read(event.dataTransfer.files[0])
  }

  return (
    <div className="adm-field">
      <label
        htmlFor={id}
        className={`adm-lw-dropzone ${dragging ? 'is-dragging' : ''}`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        {file ? <FileSpreadsheet size={26} aria-hidden /> : <FileUp size={26} aria-hidden />}
        <strong>{file ? file.name : 'Drop a CSV file here or click to choose'}</strong>
        <span className="adm-muted">
          {file
            ? `${(file.size / 1024).toFixed(1)} KB · choose another file to replace it`
            : `CSV, TSV or TXT · up to ${maxBytes / 1_000_000} MB`}
        </span>
        <input
          id={id}
          type="file"
          accept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
          className="adm-visually-hidden"
          onChange={(e) => {
            void read(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </label>
      {error ? (
        <p className="adm-field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
