import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import type { Role } from '@newsa/shared'

async function getRoles(): Promise<Role[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('roles')
      .select('*')
      .order('hierarchy_level', { ascending: false })
    return (data as Role[]) ?? []
  } catch {
    return []
  }
}

export default async function RolesPage() {
  const roles = await getRoles()

  return (
    <div>
      <PageHeader
        title="Roller"
        description={`${roles.length} sistem rolü`}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rol Adı</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Görünen Ad</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hiyerarşi</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tür</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {roles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Henüz rol yok
                </td>
              </tr>
            ) : (
              roles.map((role) => (
                <tr key={role.id} className="border-b hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{role.name}</td>
                  <td className="px-4 py-3 font-medium">{role.display_name}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {role.hierarchy_level}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={role.is_system ? 'warning' : 'secondary'}>
                      {role.is_system ? 'Sistem' : 'Özel'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/roller/${role.id}`}
                      className="text-primary hover:underline"
                    >
                      İzinleri Düzenle
                    </Link>
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
