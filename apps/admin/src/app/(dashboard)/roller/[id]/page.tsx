import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/PageHeader'
import { RolePermissionsForm } from './_components/RolePermissionsForm'
import type { Role, Permission } from '@newsa/shared'

async function getData(id: string) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    const [roleRes, permissionsRes, rolePermissionsRes] = await Promise.all([
      supabase.from('roles').select('*').eq('id', id).single(),
      supabase.from('permissions').select('*').order('module').order('name'),
      supabase.from('role_permissions').select('permission_id').eq('role_id', id),
    ])

    return {
      role: roleRes.data as Role | null,
      permissions: (permissionsRes.data as Permission[]) ?? [],
      assignedPermissionIds: (rolePermissionsRes.data ?? []).map(
        (rp: { permission_id: string }) => rp.permission_id
      ),
    }
  } catch {
    return { role: null, permissions: [], assignedPermissionIds: [] }
  }
}

export default async function RoleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const { role, permissions, assignedPermissionIds } = await getData(id)

  if (!role) notFound()

  return (
    <div>
      <PageHeader
        title={`${role.display_name} - İzin Matrisi`}
        description={role.description ?? `"${role.name}" rolünün izinlerini düzenleyin`}
      />
      <RolePermissionsForm
        roleId={role.id}
        permissions={permissions}
        assignedPermissionIds={assignedPermissionIds}
      />
    </div>
  )
}
