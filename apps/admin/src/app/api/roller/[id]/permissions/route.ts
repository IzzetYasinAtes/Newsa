import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as { permissionIds?: unknown }
    const permissionIds = body.permissionIds

    if (!Array.isArray(permissionIds)) {
      return NextResponse.json({ error: 'permissionIds must be an array' }, { status: 400 })
    }

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )

    // Auth check
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete existing role_permissions for this role
    const { error: deleteError } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    // Insert new role_permissions if any selected
    if (permissionIds.length > 0) {
      const rows = (permissionIds as string[]).map((permId) => ({
        role_id: id,
        permission_id: permId,
      }))

      const { error: insertError } = await supabase
        .from('role_permissions')
        .insert(rows)

      if (insertError) {
        return NextResponse.json({ error: insertError.message }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
