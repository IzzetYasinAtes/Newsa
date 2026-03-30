import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'
import { formatDate } from '@newsa/shared'
import type { Profile } from '@newsa/shared'

interface ProfileWithRoles extends Profile {
  user_roles: Array<{
    roles: {
      id: string
      name: string
      display_name: string
    }
  }>
}

async function getUsers(): Promise<ProfileWithRoles[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data } = await supabase
      .from('profiles')
      .select(`
        *,
        user_roles(
          roles(id, name, display_name)
        )
      `)
      .order('created_at', { ascending: false })
      .limit(100)
    return (data as ProfileWithRoles[]) ?? []
  } catch {
    return []
  }
}

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      <PageHeader
        title="Kullanicilar"
        description={`${users.length} kullanici`}
      />
      <div className="overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Ad Soyad</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">E-posta</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Roller</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Durum</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Kayit</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Islem</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  Henuz kullanici yok
                </td>
              </tr>
            ) : (
              users.map((user) => {
                const roleList = user.user_roles
                  ?.map((ur) => ur.roles)
                  .filter(Boolean) ?? []

                return (
                  <tr key={user.id} className="border-b hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium">{user.full_name}</div>
                      {user.display_name && (
                        <div className="text-xs text-muted-foreground">{user.display_name}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3">
                      {roleList.length === 0 ? (
                        <span className="text-xs text-muted-foreground">Rol yok</span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {roleList.map((role) => (
                            <Badge key={role.id} variant="default">
                              {role.display_name}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.is_active ? 'success' : 'secondary'}>
                        {user.is_active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/kullanicilar/${user.id}`}
                        className="text-primary hover:underline"
                      >
                        Duzenle
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
