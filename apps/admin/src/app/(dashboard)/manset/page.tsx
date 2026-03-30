'use client'

import { useState, useEffect, useCallback } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { PageHeader } from '@/components/PageHeader'
import { Badge } from '@/components/Badge'

interface Article {
  id: string
  title: string
  slug: string
  status: string
  is_headline: boolean
  is_featured: boolean
  is_breaking: boolean
  headline_order: number | null
  featured_order: number | null
  breaking_expires_at: string | null
  published_at: string | null
}

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('tr-TR')
}

function ArticleSearchModal({
  onSelect,
  onClose,
}: {
  onSelect: (article: Article) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); return }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('articles')
      .select('id, title, slug, status, is_headline, is_featured, is_breaking, headline_order, featured_order, breaking_expires_at, published_at')
      .ilike('title', `%${q}%`)
      .eq('status', 'published')
      .limit(10)
    setResults((data as Article[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => search(query), 300)
    return () => clearTimeout(t)
  }, [query, search])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-lg rounded-lg bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold">Haber Ara</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">✕</button>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Haber başlığı..."
          className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
        <div className="mt-3 max-h-64 overflow-y-auto space-y-2">
          {loading && <p className="py-4 text-center text-sm text-muted-foreground">Aranıyor...</p>}
          {!loading && results.length === 0 && query && (
            <p className="py-4 text-center text-sm text-muted-foreground">Sonuç bulunamadı</p>
          )}
          {results.map((a) => (
            <button
              key={a.id}
              onClick={() => onSelect(a)}
              className="w-full rounded-md border p-3 text-left text-sm hover:bg-muted"
            >
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-muted-foreground">{a.slug}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function HeadlineSection({ articles, onRefresh }: { articles: Article[]; onRefresh: () => void }) {
  const [showSearch, setShowSearch] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  async function addToHeadline(article: Article) {
    const supabase = createClient()
    const maxOrder = articles.reduce((m, a) => Math.max(m, a.headline_order ?? 0), 0)
    await supabase
      .from('articles')
      .update({ is_headline: true, headline_order: maxOrder + 1 })
      .eq('id', article.id)
    setShowSearch(false)
    onRefresh()
  }

  async function removeFromHeadline(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('articles').update({ is_headline: false, headline_order: null }).eq('id', id)
    setSaving(null)
    onRefresh()
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Manşet Haberler</h2>
        <button
          onClick={() => setShowSearch(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          + Haber Ekle
        </button>
      </div>
      {articles.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Manşet haber yok</p>
      ) : (
        <div className="space-y-2">
          {articles.sort((a, b) => (a.headline_order ?? 0) - (b.headline_order ?? 0)).map((article) => (
            <div key={article.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <span className="cursor-grab text-muted-foreground">⠿</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{article.title}</p>
                <p className="text-xs text-muted-foreground">Sıra: {article.headline_order ?? '-'}</p>
              </div>
              <button
                onClick={() => removeFromHeadline(article.id)}
                disabled={saving === article.id}
                className="rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                {saving === article.id ? '...' : 'Kaldır'}
              </button>
            </div>
          ))}
        </div>
      )}
      {showSearch && <ArticleSearchModal onSelect={addToHeadline} onClose={() => setShowSearch(false)} />}
    </div>
  )
}

function FeaturedSection({ articles, onRefresh }: { articles: Article[]; onRefresh: () => void }) {
  const [showSearch, setShowSearch] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  async function addToFeatured(article: Article) {
    const supabase = createClient()
    const maxOrder = articles.reduce((m, a) => Math.max(m, a.featured_order ?? 0), 0)
    await supabase
      .from('articles')
      .update({ is_featured: true, featured_order: maxOrder + 1 })
      .eq('id', article.id)
    setShowSearch(false)
    onRefresh()
  }

  async function removeFromFeatured(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('articles').update({ is_featured: false, featured_order: null }).eq('id', id)
    setSaving(null)
    onRefresh()
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Öne Çıkan Haberler</h2>
        <button
          onClick={() => setShowSearch(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          + Haber Ekle
        </button>
      </div>
      {articles.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Öne çıkan haber yok</p>
      ) : (
        <div className="space-y-2">
          {articles.sort((a, b) => (a.featured_order ?? 0) - (b.featured_order ?? 0)).map((article) => (
            <div key={article.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
              <span className="cursor-grab text-muted-foreground">⠿</span>
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{article.title}</p>
                <p className="text-xs text-muted-foreground">Sıra: {article.featured_order ?? '-'}</p>
              </div>
              <button
                onClick={() => removeFromFeatured(article.id)}
                disabled={saving === article.id}
                className="rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
              >
                {saving === article.id ? '...' : 'Kaldır'}
              </button>
            </div>
          ))}
        </div>
      )}
      {showSearch && <ArticleSearchModal onSelect={addToFeatured} onClose={() => setShowSearch(false)} />}
    </div>
  )
}

function BreakingSection({ articles, onRefresh }: { articles: Article[]; onRefresh: () => void }) {
  const [showSearch, setShowSearch] = useState(false)
  const [saving, setSaving] = useState<string | null>(null)

  async function addToBreaking(article: Article) {
    const supabase = createClient()
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
    await supabase
      .from('articles')
      .update({ is_breaking: true, breaking_expires_at: expires })
      .eq('id', article.id)
    setShowSearch(false)
    onRefresh()
  }

  async function extendBreaking(id: string) {
    setSaving(id)
    const supabase = createClient()
    const expires = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
    await supabase.from('articles').update({ breaking_expires_at: expires }).eq('id', id)
    setSaving(null)
    onRefresh()
  }

  async function removeFromBreaking(id: string) {
    setSaving(id)
    const supabase = createClient()
    await supabase.from('articles').update({ is_breaking: false, breaking_expires_at: null }).eq('id', id)
    setSaving(null)
    onRefresh()
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-base font-semibold">Son Dakika Haberleri</h2>
        <button
          onClick={() => setShowSearch(true)}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-primary/90"
        >
          + Haber Ekle
        </button>
      </div>
      {articles.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Son dakika haberi yok</p>
      ) : (
        <div className="space-y-2">
          {articles.map((article) => {
            const expired = article.breaking_expires_at ? new Date(article.breaking_expires_at) < new Date() : false
            return (
              <div key={article.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{article.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Son: {formatDate(article.breaking_expires_at)}
                    {expired && <span className="ml-2 text-destructive">(Süresi Doldu)</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => extendBreaking(article.id)}
                    disabled={saving === article.id}
                    className="rounded-md border px-2 py-1 text-xs hover:bg-muted disabled:opacity-50"
                  >
                    {saving === article.id ? '...' : '+2s Uzat'}
                  </button>
                  <button
                    onClick={() => removeFromBreaking(article.id)}
                    disabled={saving === article.id}
                    className="rounded-md border px-2 py-1 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
      {showSearch && <ArticleSearchModal onSelect={addToBreaking} onClose={() => setShowSearch(false)} />}
    </div>
  )
}

type Tab = 'manset' | 'featured' | 'breaking'

export default function MansetPage() {
  const [activeTab, setActiveTab] = useState<Tab>('manset')
  const [headlineArticles, setHeadlineArticles] = useState<Article[]>([])
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([])
  const [breakingArticles, setBreakingArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  const loadArticles = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const fields = 'id, title, slug, status, is_headline, is_featured, is_breaking, headline_order, featured_order, breaking_expires_at, published_at'

    const [headlines, featured, breaking] = await Promise.all([
      supabase.from('articles').select(fields).eq('is_headline', true).order('headline_order'),
      supabase.from('articles').select(fields).eq('is_featured', true).order('featured_order'),
      supabase.from('articles').select(fields).eq('is_breaking', true).order('published_at', { ascending: false }),
    ])

    setHeadlineArticles((headlines.data as Article[]) ?? [])
    setFeaturedArticles((featured.data as Article[]) ?? [])
    setBreakingArticles((breaking.data as Article[]) ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadArticles() }, [loadArticles])

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'manset', label: 'Manşet', count: headlineArticles.length },
    { id: 'featured', label: 'Öne Çıkan', count: featuredArticles.length },
    { id: 'breaking', label: 'Son Dakika', count: breakingArticles.length },
  ]

  return (
    <div>
      <PageHeader title="Manşet Yönetimi" description="Manşet, öne çıkan ve son dakika haberlerini yönetin" />
      <div className="flex gap-2 border-b mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            <Badge variant="secondary">{tab.count}</Badge>
          </button>
        ))}
      </div>
      {loading ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Yükleniyor...</p>
      ) : (
        <div>
          {activeTab === 'manset' && <HeadlineSection articles={headlineArticles} onRefresh={loadArticles} />}
          {activeTab === 'featured' && <FeaturedSection articles={featuredArticles} onRefresh={loadArticles} />}
          {activeTab === 'breaking' && <BreakingSection articles={breakingArticles} onRefresh={loadArticles} />}
        </div>
      )}
    </div>
  )
}
