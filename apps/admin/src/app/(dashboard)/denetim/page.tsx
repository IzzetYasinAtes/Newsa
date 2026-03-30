import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'

interface AuditLog {
  id: string
  action: string
  entity_type: string | null
  entity_id: string | null
  created_at: string
  user_id: string | null
  profiles: {
    display_name: string | null
    full_name: string | null
    email: string | null
  }[] | null
}

async function getAuditLogs(): Promise<AuditLog[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('audit_logs')
      .select('id, action, entity_type, entity_id, created_at, user_id, profiles(display_name, full_name, email)')
      .order('created_at', { ascending: false })
      .limit(200)
    return (data as AuditLog[]) ?? []
  } catch {
    return []
  }
}

function getUserName(log: AuditLog): string {
  const profile = Array.isArray(log.profiles) ? log.profiles[0] : log.profiles
  if (!profile) return log.user_id ? log.user_id.slice(0, 8) + '...' : 'Bilinmiyor'
  return profile.display_name ?? profile.full_name ?? profile.email ?? 'Bilinmiyor'
}

const actionColors: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-gray-100 text-gray-700',
}

export default async function DenetimPage() {
  const logs = await getAuditLogs()

  return (
    <div>
      <PageHeader
        title="Denetim Logları"
        description={`Son ${logs.length} kayıt`}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kullanıcı</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">İşlem</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Varlık Türü</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Varlık ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tarih</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Henüz log kaydı yok
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{getUserName(log)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${actionColors[log.action] ?? 'bg-muted text-muted-foreground'}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{log.entity_type ?? '-'}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {log.entity_id ? log.entity_id.slice(0, 8) + '...' : '-'}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(log.created_at).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
