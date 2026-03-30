import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { UserDetailForm } from './_components/UserDetailForm'
import type { Profile, Role } from '@newsa/shared'

async function getData(id: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const [profileRes, rolesRes, userRolesRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('roles').select('*').order('hierarchy_level', { ascending: false }),
      supabase.from('user_roles').select('role_id').eq('user_id', id),
    ])

    return {
      user: profileRes.data as Profile | null,
      allRoles: (rolesRes.data as Role[]) ?? [],
      assignedRoleIds: (userRolesRes.data ?? []).map(
        (ur: { role_id: string }) => ur.role_id
      ),
    }
  } catch {
    return { user: null, allRoles: [], assignedRoleIds: [] }
  }
}

export default async function UserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { user, allRoles, assignedRoleIds } = await getData(id)

  if (!user) notFound()

  return (
    <div>
      <PageHeader
        title={user.full_name}
        description={user.email}
      />
      <UserDetailForm
        user={user}
        allRoles={allRoles}
        assignedRoleIds={assignedRoleIds}
      />
    </div>
  )
}
