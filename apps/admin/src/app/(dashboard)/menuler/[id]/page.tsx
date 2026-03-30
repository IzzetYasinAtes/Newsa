'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase'
import { PageHeader } from '@/components/PageHeader'

interface MenuItem {
  id: string
  menu_id: string
  label: string
  url: string
  link_type: string
  target: string
  sort_order: number
  is_active: boolean
}

interface Menu {
  id: string
  name: string
  location: string
}


const linkTypeOptions = [
  { value: 'internal', label: 'İç Bağlantı' },
  { value: 'external', label: 'Dış Bağlantı' },
  { value: 'category', label: 'Kategori' },
  { value: 'tag', label: 'Etiket' },
]

const targetOptions = [
  { value: '_self', label: 'Aynı Sekme' },
  { value: '_blank', label: 'Yeni Sekme' },
]

export default function MenuDetailPage() {
  const params = useParams()
  const menuId = params.id as string

  const [menu, setMenu] = useState<Menu | null>(null)
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [newItem, setNewItem] = useState({
    label: '',
    url: '',
    link_type: 'internal',
    target: '_self',
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    const supabase = getSupabaseBrowserClient()
    const [menuRes, itemsRes] = await Promise.all([
      supabase.from('menus').select('*').eq('id', menuId).single(),
      supabase.from('menu_items').select('*').eq('menu_id', menuId).order('sort_order'),
    ])
    setMenu(menuRes.data as Menu | null)
    setItems((itemsRes.data as MenuItem[]) ?? [])
    setLoading(false)
  }, [menuId])

  useEffect(() => { loadData() }, [loadData])

  async function addItem() {
    if (!newItem.label.trim() || !newItem.url.trim()) {
      setMessage({ type: 'error', text: 'Etiket ve URL zorunludur' })
      return
    }
    setSaving(true)
    const supabase = getSupabaseBrowserClient()
    const maxOrder = items.reduce((m, i) => Math.max(m, i.sort_order), 0)
    const { error } = await supabase.from('menu_items').insert({
      menu_id: menuId,
      label: newItem.label,
      url: newItem.url,
      link_type: newItem.link_type,
      target: newItem.target,
      sort_order: maxOrder + 1,
      is_active: true,
    })
    if (error) {
      setMessage({ type: 'error', text: 'Eklenemedi: ' + error.message })
    } else {
      setMessage({ type: 'success', text: 'Öğe eklendi' })
      setNewItem({ label: '', url: '', link_type: 'internal', target: '_self' })
      await loadData()
    }
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  async function deleteItem(id: string) {
    setDeleting(id)
    const supabase = getSupabaseBrowserClient()
    await supabase.from('menu_items').delete().eq('id', id)
    setDeleting(null)
    await loadData()
  }

  async function saveOrder() {
    setSaving(true)
    const supabase = getSupabaseBrowserClient()
    await Promise.all(
      items.map((item, idx) =>
        supabase.from('menu_items').update({ sort_order: idx + 1 }).eq('id', item.id)
      )
    )
    setMessage({ type: 'success', text: 'Sıralama kaydedildi' })
    setSaving(false)
    setTimeout(() => setMessage(null), 3000)
  }

  function moveItem(idx: number, dir: -1 | 1) {
    const newItems = [...items]
    const target = idx + dir
    if (target < 0 || target >= newItems.length) return
    ;[newItems[idx], newItems[target]] = [newItems[target], newItems[idx]]
    setItems(newItems)
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Menü Detayı" />
        <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={menu?.name ?? 'Menü'}
        description={`${items.length} öğe`}
      />

      {message && (
        <div className={`mb-4 rounded-md p-3 text-sm ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Items List */}
        <div className="rounded-lg border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Menü Öğeleri</h2>
            <button
              onClick={saveOrder}
              disabled={saving}
              className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : 'Sıralamayı Kaydet'}
            </button>
          </div>
          {items.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Henüz öğe yok</p>
          ) : (
            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 rounded-md border p-3">
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => moveItem(idx, -1)}
                      disabled={idx === 0}
                      className="text-xs leading-none text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => moveItem(idx, 1)}
                      disabled={idx === items.length - 1}
                      className="text-xs leading-none text-muted-foreground hover:text-foreground disabled:opacity-30"
                    >
                      ▼
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="truncate text-xs text-muted-foreground">{item.url}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.link_type} · {item.target === '_blank' ? 'Yeni sekme' : 'Aynı sekme'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteItem(item.id)}
                    disabled={deleting === item.id}
                    className="rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    {deleting === item.id ? '...' : 'Sil'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add New Item Form */}
        <div className="rounded-lg border bg-card p-5">
          <h2 className="mb-4 font-semibold">Yeni Öğe Ekle</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Etiket *</label>
              <input
                type="text"
                value={newItem.label}
                onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
                placeholder="Menü öğesi adı"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">URL *</label>
              <input
                type="text"
                value={newItem.url}
                onChange={(e) => setNewItem((p) => ({ ...p, url: e.target.value }))}
                placeholder="/hakkimizda veya https://..."
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Bağlantı Türü</label>
              <select
                value={newItem.link_type}
                onChange={(e) => setNewItem((p) => ({ ...p, link_type: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {linkTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Hedef</label>
              <select
                value={newItem.target}
                onChange={(e) => setNewItem((p) => ({ ...p, target: e.target.value }))}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {targetOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <button
              onClick={addItem}
              disabled={saving}
              className="w-full rounded-md bg-primary py-2 text-sm text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? 'Ekleniyor...' : 'Öğe Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
