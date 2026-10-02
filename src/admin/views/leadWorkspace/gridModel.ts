import type { LeadFieldKey, SalesLead } from '../../api/leadWorkspace'

export type ColumnKey =
  | 'businessName'
  | 'category'
  | 'contactName'
  | 'phone'
  | 'email'
  | 'website'
  | 'city'
  | 'potentialServices'
  | 'status'
  | 'tags'
  | 'notes'

export type GridColumn = {
  key: ColumnKey
  label: string
  width: number
  sort?: string
  kind: 'text' | 'list' | 'status'
  placeholder?: string
}

/** Service option meaning "not decided yet"; must match the backend SALES_SERVICES entry. */
export const NEED_TO_KNOW = 'Need to Know'

export const GRID_COLUMNS: GridColumn[] = [
  {
    key: 'businessName',
    label: 'Business Name',
    width: 240,
    sort: 'businessName',
    kind: 'text',
    placeholder: 'Business name',
  },
  { key: 'category', label: 'Category', width: 150, sort: 'category', kind: 'text' },
  { key: 'contactName', label: 'Contact Name', width: 150, kind: 'text' },
  { key: 'phone', label: 'Phone', width: 150, kind: 'text' },
  { key: 'email', label: 'Email', width: 200, kind: 'text' },
  { key: 'website', label: 'Website', width: 200, kind: 'text' },
  { key: 'city', label: 'City', width: 130, sort: 'city', kind: 'text' },
  { key: 'potentialServices', label: 'Service Needed', width: 240, kind: 'list', placeholder: 'SEO, Google Ads' },
  { key: 'status', label: 'Status', width: 130, sort: 'status', kind: 'status' },
  { key: 'tags', label: 'Tags', width: 170, kind: 'list', placeholder: 'tag, another' },
  { key: 'notes', label: 'Notes', width: 260, kind: 'text' },
]

export const COLUMN_COUNT = GRID_COLUMNS.length

/** Editable text for a lead field; list fields are comma-separated like the server accepts. */
export const leadCellText = (lead: SalesLead, key: LeadFieldKey): string => {
  const value = lead[key]
  if (Array.isArray(value)) return value.join(', ')
  return value ?? ''
}

export const splitList = (text: string) =>
  text
    .split(/[,;|\n]/)
    .map((item) => item.trim())
    .filter(Boolean)

/**
 * Parses clipboard text from Excel, Google Sheets or Notion: tab-separated cells, one row
 * per line, with "quoted" cells that may contain tabs, newlines and doubled quotes.
 */
export function parseClipboardTable(text: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let quoted = false
  let atCellStart = true
  const input = text.replace(/\r\n?/g, '\n')

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        quoted = false
      } else {
        cell += ch
      }
      continue
    }
    if (ch === '"' && atCellStart) {
      quoted = true
      atCellStart = false
    } else if (ch === '\t') {
      row.push(cell)
      cell = ''
      atCellStart = true
    } else if (ch === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      atCellStart = true
    } else {
      cell += ch
      atCellStart = false
    }
  }
  if (cell !== '' || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }
  return rows.map((r) => r.map((c) => c.trim())).filter((r) => r.some((c) => c !== ''))
}

const FIELD_ALIASES: Record<LeadFieldKey, string[]> = {
  businessName: [
    'business name',
    'business',
    'name',
    'company',
    'company name',
    'shop',
    'store',
    'brand',
    'organisation',
    'organization',
  ],
  category: ['category', 'type', 'industry', 'business type', 'niche', 'sector'],
  contactName: ['contact name', 'contact person', 'contact', 'person'],
  phone: [
    'phone',
    'phone number',
    'mobile',
    'mobile number',
    'contact number',
    'tel',
    'telephone',
    'whatsapp',
    'number',
  ],
  email: ['email', 'email address', 'e mail', 'mail'],
  website: ['website', 'website url', 'url', 'site', 'web', 'domain', 'web address'],
  address: ['address', 'street address', 'full address', 'location address'],
  city: ['city', 'town'],
  state: ['state', 'province', 'region'],
  country: ['country'],
  googleMapsUrl: ['google maps', 'google maps url', 'maps', 'maps url', 'map link', 'gmaps'],
  potentialServices: [
    'service needed',
    'services needed',
    'potential services',
    'services',
    'service',
    'potential service',
  ],
  tags: ['tags', 'tag', 'labels', 'label'],
  status: ['status', 'stage', 'lead status'],
  notes: ['notes', 'note', 'comments', 'comment', 'remarks'],
}

const aliasKey = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const FIELD_BY_ALIAS = new Map<string, LeadFieldKey>(
  (Object.entries(FIELD_ALIASES) as [LeadFieldKey, string[]][]).flatMap(([key, aliases]) =>
    aliases.map((alias) => [alias, key] as const),
  ),
)

/**
 * If the first pasted row is a header row (most cells name a lead field, including
 * Business Name), returns the field for each column; unrecognised columns are null.
 */
export function detectHeader(firstRow: string[]): (LeadFieldKey | null)[] | null {
  const fields = firstRow.map((cell) => FIELD_BY_ALIAS.get(aliasKey(cell)) ?? null)
  const named = firstRow.filter((cell) => cell !== '').length
  const matched = fields.filter(Boolean)
  if (!fields.includes('businessName') || matched.length < Math.max(2, Math.ceil(named / 2))) return null
  return fields.map((field, i) => (field && fields.indexOf(field) === i ? field : null))
}
