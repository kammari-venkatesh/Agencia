import { useData } from 'vike-react/useData'
import GuidePage from '../../../components/GuidePage'
import type { Data } from './+data'

export default function Page() {
  const page = useData<Data>()
  return <GuidePage page={page} />
}
