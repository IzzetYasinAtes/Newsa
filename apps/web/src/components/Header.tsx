import Link from 'next/link'

const categories = [
  { name: 'Gundem', slug: 'gundem' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Kultur-Sanat', slug: 'kultur-sanat' },
]

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-primary">
          Newsa
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
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
        <div className="flex items-center gap-2">
          <Link
            href="/arama"
            className="rounded-md p-2 text-muted-foreground hover:bg-accent"
            aria-label="Arama"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
