import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

interface UpdateUserBody {
  full_name?: string
  display_name?: string | null
  bio?: string | null
  is_active?: boolean
  role_ids?: string[]
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json() as UpdateUserBody

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

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        full_name: body.full_name,
        display_name: body.display_name ?? null,
        bio: body.bio ?? null,
        is_active: body.is_active ?? true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 })
    }

    // Update user roles if provided
    if (Array.isArray(body.role_ids)) {
      // Delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', id)

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 })
      }

      // Insert new roles
      if (body.role_ids.length > 0) {
        const rows = body.role_ids.map((roleId) => ({
          user_id: id,
          role_id: roleId,
          assigned_by: user.id,
        }))

        const { error: insertError } = await supabase
          .from('user_roles')
          .insert(rows)

        if (insertError) {
          return NextResponse.json({ error: insertError.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
