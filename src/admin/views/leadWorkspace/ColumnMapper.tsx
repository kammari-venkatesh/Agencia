import type { ColumnMapping, ColumnTarget, ImportPreview, WorkspaceMeta } from '../../api/leadWorkspace'

type ColumnMapperProps = {
  preview: ImportPreview
  mapping: ColumnMapping[]
  fields: WorkspaceMeta['fields']
  duplicateMode: 'skip' | 'update'
  disabled: boolean
  onMappingChange: (mapping: ColumnMapping[]) => void
  onHeaderChange: (hasHeader: boolean) => void
  onDuplicateModeChange: (mode: 'skip' | 'update') => void
}

const DELIMITER_LABEL = {
  tab: 'Tab-separated (spreadsheet paste)',
  comma: 'Comma-separated',
  semicolon: 'Semicolon-separated',
}

export function ColumnMapper(props: ColumnMapperProps) {
  const { preview, mapping, fields, duplicateMode, disabled } = props
  const usedTargets = new Map(mapping.map((m, i) => [m.target, i]))

  const update = (index: number, patch: Partial<ColumnMapping>) =>
    props.onMappingChange(mapping.map((m, i) => (i === index ? { ...m, ...patch } : m)))

  const setTarget = (index: number, target: ColumnTarget) =>
    update(index, {
      target,
      customName: target === 'custom' ? mapping[index].customName || preview.columns[index]?.header || '' : undefined,
    })

  return (
    <div className="adm-lw-mapper">
      <div className="adm-lw-mapper-options">
        <span className="adm-tag">{DELIMITER_LABEL[preview.delimiter]}</span>
        <span className="adm-tag">
          {preview.rowCount.toLocaleString()} data {preview.rowCount === 1 ? 'row' : 'rows'}
        </span>
        <label className="adm-lw-check">
          <input
            type="checkbox"
            checked={preview.hasHeader}
            disabled={disabled}
            onChange={(e) => props.onHeaderChange(e.target.checked)}
          />
          First row contains column names
        </label>
        <fieldset className="adm-lw-radio-group" disabled={disabled}>
          <legend className="adm-visually-hidden">Duplicate handling</legend>
          <span className="adm-muted">Duplicates:</span>
          <label className="adm-lw-check">
            <input
              type="radio"
              name="duplicateMode"
              checked={duplicateMode === 'skip'}
              onChange={() => props.onDuplicateModeChange('skip')}
            />
            Skip
          </label>
          <label className="adm-lw-check">
            <input
              type="radio"
              name="duplicateMode"
              checked={duplicateMode === 'update'}
              onChange={() => props.onDuplicateModeChange('update')}
            />
            Update existing lead
          </label>
        </fieldset>
      </div>

      <div className="adm-lw-table-scroll adm-lw-mapper-scroll">
        <table className="adm-table adm-lw-mapper-table">
          <thead>
            <tr>
              <th scope="col">Column</th>
              <th scope="col">Sample values</th>
              <th scope="col">Import as</th>
            </tr>
          </thead>
          <tbody>
            {preview.columns.map((column) => {
              const entry = mapping[column.index] ?? { target: 'ignore' as const }
              const error = preview.mappingErrors[`column${column.index}`]
              return (
                <tr key={column.index} className={entry.target === 'ignore' ? 'is-ignored' : ''}>
                  <td className="adm-cell-nowrap">
                    <strong>{column.header}</strong>
                  </td>
                  <td>
                    <span className="adm-cell-sub adm-lw-samples" title={column.samples.filter(Boolean).join(' · ')}>
                      {column.samples.filter(Boolean).join(' · ') || <span className="adm-muted">(empty)</span>}
                    </span>
                  </td>
                  <td>
                    <div className="adm-lw-mapper-target">
                      <select
                        className="adm-select adm-lw-select"
                        aria-label={`Import "${column.header}" as`}
                        value={entry.target}
                        disabled={disabled}
                        onChange={(e) => setTarget(column.index, e.target.value as ColumnTarget)}
                      >
                        {fields.map((field) => {
                          const takenBy = usedTargets.get(field.key)
                          const taken = takenBy !== undefined && takenBy !== column.index
                          return (
                            <option key={field.key} value={field.key} disabled={taken}>
                              {field.label}
                              {field.required ? ' (required)' : ''}
                              {taken ? ' — already mapped' : ''}
                            </option>
                          )
                        })}
                        <option value="custom">Custom field…</option>
                        <option value="ignore">Don't import</option>
                      </select>
                      {entry.target === 'custom' ? (
                        <input
                          className="adm-lw-plain-input"
                          aria-label={`Custom field name for "${column.header}"`}
                          placeholder="Custom field name"
                          maxLength={60}
                          value={entry.customName ?? ''}
                          disabled={disabled}
                          onChange={(e) => update(column.index, { customName: e.target.value })}
                        />
                      ) : null}
                    </div>
                    {error ? <p className="adm-field-error">{error}</p> : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
