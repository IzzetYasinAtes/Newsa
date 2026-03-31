'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, type FormEvent } from 'react'

interface SearchFormProps {
  initialQuery: string
}

export function SearchForm({ initialQuery }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed) {
      router.push(`/arama?q=${encodeURIComponent(trimmed)}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2" role="search">
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Haber ara..."
        aria-label="Arama sorgusu"
        className="flex-1 rounded-lg border bg-background px-5 py-3 text-base outline-none focus:ring-2 focus:ring-primary"
      />
      <button
        type="submit"
        className="rounded-lg bg-primary px-8 py-3 text-base font-medium text-primary-foreground hover:bg-primary/90"
      >
        Ara
      </button>
    </form>
  )
}
