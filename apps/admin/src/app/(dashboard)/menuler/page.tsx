import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { PageHeader } from '@/components/PageHeader'

interface Menu {
  id: string
  name: string
  location: string
  is_active: boolean
}

interface MenuWithCount extends Menu {
  itemCount: number
}

async function getMenus(): Promise<MenuWithCount[]> {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll() { return cookieStore.getAll() }, setAll() {} } }
    )
    const { data: menus } = await supabase.from('menus').select('*').order('name')
    if (!menus) return []

    const menuIds = menus.map((m: Menu) => m.id)
    const counts: Record<string, number> = {}

    if (menuIds.length > 0) {
      const { data: items } = await supabase
        .from('menu_items')
        .select('menu_id')
        .in('menu_id', menuIds)

      for (const item of (items ?? [])) {
        const menuItem = item as { menu_id: string }
        counts[menuItem.menu_id] = (counts[menuItem.menu_id] ?? 0) + 1
      }
    }

    return menus.map((m: Menu) => ({ ...m, itemCount: counts[m.id] ?? 0 }))
  } catch {
    return []
  }
}

const locationLabels: Record<string, string> = {
  header_main: 'Üst Menü (Ana)',
  footer_links: 'Alt Menü',
  sidebar: 'Kenar Çubuğu',
}

export default async function MenulerPage() {
  const menus = await getMenus()

  return (
    <div>
      <PageHeader title="Menü Yönetimi" description={`${menus.length} menü`} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {menus.length === 0 ? (
          <div className="col-span-3 py-12 text-center text-sm text-muted-foreground">
            Henüz menü yok
          </div>
        ) : (
          menus.map((menu) => (
            <Link
              key={menu.id}
              href={`/menuler/${menu.id}`}
              className="rounded-lg border bg-card p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold">{menu.name}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${menu.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {menu.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {locationLabels[menu.location] ?? menu.location}
              </p>
              <p className="text-sm font-medium">{menu.itemCount} öğe</p>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
