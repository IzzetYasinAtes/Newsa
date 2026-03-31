'use client'

import { useState } from 'react'
import Link from 'next/link'

const categories = [
  { name: 'Gündem', slug: 'gundem' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Dünya', slug: 'dunya' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
  { name: 'Sağlık', slug: 'saglik' },
  { name: 'Bilim', slug: 'bilim' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="shrink-0 text-2xl font-bold text-primary">
          Newsa
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-5 md:flex">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/kategori/${cat.slug}`}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Right side: Search + Mobile hamburger */}
        <div className="flex items-center gap-2">
          {/* Search */}
          {isSearchOpen ? (
            <form action="/arama" method="get" className="flex items-center">
              <input
                type="search"
                name="q"
                placeholder="Haber ara..."
                autoFocus
                className="h-9 w-40 rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary sm:w-56"
                onBlur={() => setIsSearchOpen(false)}
              />
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="rounded-md p-2 text-muted-foreground hover:bg-accent"
              aria-label="Arama"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          )}

          {/* Hamburger - mobile only */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-muted-foreground hover:bg-accent md:hidden"
            aria-label={isMobileMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="border-t bg-background px-4 pb-4 pt-2 md:hidden">
          <ul className="space-y-1">
            {categories.map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/kategori/${cat.slug}`}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
