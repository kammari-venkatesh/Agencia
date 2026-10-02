import type { ColumnMapping } from '../../api/leadWorkspace'

/** Client-side check mirroring the server rules so obvious problems show before a round trip. */
export function mappingProblems(mapping: ColumnMapping[]): string[] {
  const problems: string[] = []
  const used = mapping.filter((m) => m.target !== 'custom' && m.target !== 'ignore').map((m) => m.target)
  if (!used.includes('businessName')) problems.push('Map one column to Business Name — it is the only required field.')
  const repeated = [...new Set(used.filter((t, i) => used.indexOf(t) !== i))]
  if (repeated.length) problems.push(`Each standard field can be used once (repeated: ${repeated.join(', ')}).`)
  if (mapping.some((m) => m.target === 'custom' && !m.customName?.trim())) {
    problems.push('Give every custom field a name.')
  }
  return problems
}
