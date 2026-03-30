'use client'

import { useState, useTransition } from 'react'
import type { Permission } from '@newsa/shared'

interface RolePermissionsFormProps {
  roleId: string
  permissions: Permission[]
  assignedPermissionIds: string[]
}

export function RolePermissionsForm({
  roleId,
  permissions,
  assignedPermissionIds,
}: RolePermissionsFormProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set(assignedPermissionIds))
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Group permissions by module
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = []
    acc[perm.module].push(perm)
    return acc
  }, {})

  const moduleLabels: Record<string, string> = {
    articles:   'Haberler',
    categories: 'Kategoriler',
    tags:       'Etiketler',
    media:      'Medya',
    users:      'Kullanıcılar',
    roles:      'Roller',
    settings:   'Ayarlar',
    ads:        'Reklamlar',
    menus:      'Menüler',
    audit:      'Denetim',
    analytics:  'Analitik',
    pages:      'Sayfalar',
    redirects:  'Yönlendirmeler',
    trash:      'Çöp Kutusu',
  }

  function toggle(permId: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(permId)) {
        next.delete(permId)
      } else {
        next.add(permId)
      }
      return next
    })
  }

  function toggleModule(module: string) {
    const modulePerms = grouped[module] ?? []
    const allSelected = modulePerms.every((p) => selected.has(p.id))
    setSelected((prev) => {
      const next = new Set(prev)
      for (const p of modulePerms) {
        if (allSelected) {
          next.delete(p.id)
        } else {
          next.add(p.id)
        }
      }
      return next
    })
  }

  async function handleSave() {
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/roller/${roleId}/permissions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissionIds: Array.from(selected) }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setMessage({ type: 'error', text: (err as { error?: string }).error ?? 'Kayıt başarısız' })
          return
        }
        setMessage({ type: 'success', text: 'İzinler başarıyla kaydedildi.' })
      } catch {
        setMessage({ type: 'error', text: 'Sunucu bağlantı hatası.' })
      }
    })
  }

  return (
    <div className="space-y-6">
      {message && (
        <div
          className={`rounded-md px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {Object.entries(grouped).map(([module, perms]) => {
        const allSelected = perms.every((p) => selected.has(p.id))
        const someSelected = perms.some((p) => selected.has(p.id))
        const label = moduleLabels[module] ?? module

        return (
          <div key={module} className="rounded-lg border bg-card">
            <div className="flex items-center gap-3 border-b bg-muted/30 px-4 py-3">
              <input
                type="checkbox"
                id={`module-${module}`}
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = !allSelected && someSelected
                }}
                onChange={() => toggleModule(module)}
                className="h-4 w-4 rounded border-gray-300 text-primary"
              />
              <label
                htmlFor={`module-${module}`}
                className="text-sm font-semibold cursor-pointer select-none"
              >
                {label}
              </label>
              <span className="ml-auto text-xs text-muted-foreground">
                {perms.filter((p) => selected.has(p.id)).length} / {perms.length}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {perms.map((perm) => (
                <label
                  key={perm.id}
                  className="flex items-center gap-2 rounded-md p-2 hover:bg-muted/50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.has(perm.id)}
                    onChange={() => toggle(perm.id)}
                    className="h-4 w-4 rounded border-gray-300 text-primary"
                  />
                  <span className="text-xs leading-tight">{perm.display_name}</span>
                </label>
              ))}
            </div>
          </div>
        )
      })}

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Toplam {selected.size} izin seçili
        </p>
        <button
          onClick={handleSave}
          disabled={isPending}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
