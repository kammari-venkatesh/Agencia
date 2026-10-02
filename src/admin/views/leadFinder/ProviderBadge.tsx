import { providerLabel, type LeadFinderJob } from '../../api/leadFinder'
import { StatusBadge } from '../../components/StatusBadge'

/** The provider stored on the job, so a real search is never mistaken for test data or the reverse. */
export function ProviderBadge({ provider }: { provider: LeadFinderJob['provider'] }) {
  return (
    <StatusBadge tone={provider === 'apify' ? 'accent' : provider === 'test' ? 'info' : 'warning'}>
      {providerLabel(provider)}
    </StatusBadge>
  )
}
