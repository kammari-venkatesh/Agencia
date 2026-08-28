import { useData } from 'vike-react/useData'
import ServicePage from '../../../components/ServicePage'
import type { Data } from './+data'

export default function Page() {
  const page = useData<Data>()
  return <ServicePage page={page} />
}
