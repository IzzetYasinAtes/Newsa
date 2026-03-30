'use client'

import { useState, useTransition } from 'react'
import type { Profile, Role } from '@newsa/shared'

interface UserDetailFormProps {
  user: Profile
  allRoles: Role[]
  assignedRoleIds: string[]
}

export function UserDetailForm({ user, allRoles, assignedRoleIds }: UserDetailFormProps) {
  const [fullName, setFullName] = useState(user.full_name)
  const [displayName, setDisplayName] = useState(user.display_name ?? '')
  const [bio, setBio] = useState(user.bio ?? '')
  const [isActive, setIsActive] = useState(user.is_active)
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set(assignedRoleIds))
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  function toggleRole(roleId: string) {
    setSelectedRoles((prev) => {
      const next = new Set(prev)
      if (next.has(roleId)) {
        next.delete(roleId)
      } else {
        next.add(roleId)
      }
      return next
    })
  }

  async function handleSave() {
    setMessage(null)
    startTransition(async () => {
      try {
        const res = await fetch(`/api/kullanicilar/${user.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: fullName,
            display_name: displayName || null,
            bio: bio || null,
            is_active: isActive,
            role_ids: Array.from(selectedRoles),
          }),
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({}))
          setMessage({ type: 'error', text: (err as { error?: string }).error ?? 'Kayit basisariz' })
          return
        }
        setMessage({ type: 'success', text: 'Kullanici basariyla guncellendi.' })
      } catch {
        setMessage({ type: 'error', text: 'Sunucu baglanti hatasi.' })
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

      {/* Profil Bilgileri */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold">Profil Bilgileri</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Gorunen Ad</label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-posta</label>
            <input
              type="text"
              value={user.email}
              disabled
              className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="flex items-center gap-3 pt-6">
            <input
              type="checkbox"
              id="is_active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary"
            />
            <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
              Aktif kullanici
            </label>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium">Biyografi</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
            />
          </div>
        </div>
      </div>

      {/* Rol Atama */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-base font-semibold">Rol Atama</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Kullaniciya atanacak rolleri secin. Birden fazla rol atanabilir.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {allRoles.map((role) => (
            <label
              key={role.id}
              className="flex items-start gap-3 rounded-md border p-3 hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedRoles.has(role.id)}
                onChange={() => toggleRole(role.id)}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary"
              />
              <div>
                <div className="text-sm font-medium">{role.display_name}</div>
                <div className="text-xs text-muted-foreground">
                  Seviye: {role.hierarchy_level}
                  {role.description ? ` — ${role.description}` : ''}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Kaydet */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={isPending || !fullName.trim()}
          className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Kaydediliyor...' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
