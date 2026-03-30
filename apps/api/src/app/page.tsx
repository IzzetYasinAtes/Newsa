import { redirect } from 'next/navigation'

export default function ApiRoot() {
  redirect('/api/health')
}
