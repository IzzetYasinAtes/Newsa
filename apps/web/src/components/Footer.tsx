import Link from 'next/link'

const categoryLinks = [
  { name: 'Gündem', slug: 'gundem' },
  { name: 'Ekonomi', slug: 'ekonomi' },
  { name: 'Teknoloji', slug: 'teknoloji' },
  { name: 'Spor', slug: 'spor' },
  { name: 'Kültür-Sanat', slug: 'kultur-sanat' },
]

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-lg font-bold">Newsa</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Türkiye ve bölge odaklı modern dijital haber platformu.
            </p>
          </div>
          <div>
            <h4 className="font-semibold">Kategoriler</h4>
            <ul className="mt-2 space-y-1">
              {categoryLinks.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/kategori/${cat.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold">Hakkımızda</h4>
            <ul className="mt-2 space-y-1">
              <li><Link href="/sayfa/hakkimizda" className="text-sm text-muted-foreground hover:text-foreground">Hakkımızda</Link></li>
              <li><Link href="/sayfa/iletisim" className="text-sm text-muted-foreground hover:text-foreground">İletişim</Link></li>
              <li><Link href="/sayfa/gizlilik-politikasi" className="text-sm text-muted-foreground hover:text-foreground">Gizlilik Politikası</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Newsa. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
