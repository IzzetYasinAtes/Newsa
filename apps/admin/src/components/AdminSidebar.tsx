'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarProps {
  userRole: string
}

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '\u{1F4CA}' },
  { href: '/haberler', label: 'Haberler', icon: '\u{1F4F0}' },
  { href: '/manset', label: 'Manşet Yönetimi', icon: '\u2B50' },
  { href: '/kategoriler', label: 'Kategoriler', icon: '\u{1F4C1}' },
  { href: '/etiketler', label: 'Etiketler', icon: '\u{1F3F7}\uFE0F' },
  { href: '/medya', label: 'Medya', icon: '\u{1F5BC}\uFE0F' },
  { href: '/menuler', label: 'Menüler', icon: '\u2630' },
  { href: '/sayfalar', label: 'Sayfalar', icon: '\u{1F4C4}' },
  { href: '/bildirimler', label: 'Bildirimler', icon: '\u{1F514}' },
  { href: '/kullanicilar', label: 'Kullanicilar', icon: '\u{1F465}', roles: ['admin'] },
  { href: '/roller', label: 'Roller', icon: '\u{1F510}', roles: ['admin'] },
  { href: '/denetim', label: 'Denetim Logları', icon: '\u{1F4CB}', roles: ['admin'] },
  { href: '/ayarlar', label: 'Ayarlar', icon: '\u2699\uFE0F', roles: ['admin'] },
  { href: '/cop-kutusu', label: 'Çöp Kutusu', icon: '\u{1F5D1}\uFE0F', roles: ['admin', 'editor'] },
]

export function AdminSidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()

  const visibleItems = menuItems.filter(
    (item) => !item.roles || item.roles.includes(userRole)
  )

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r bg-card md:block">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="text-lg font-bold text-primary">
          Newsa Admin
        </Link>
      </div>
      <nav className="space-y-1 p-3">
        {visibleItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
