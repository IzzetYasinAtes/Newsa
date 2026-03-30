# Erişilebilirlik (a11y) Skill'i

Haber sitesi herkes tarafından kullanılabilir olmalı. WCAG 2.1 AA standartlarına uyum hedeflenir.

## 1. Semantik HTML

```typescript
// DOGRU - Semantik elementler kullan
<header>           // Site üst bilgi
  <nav>            // Navigasyon
  </nav>
</header>
<main>             // Ana içerik (sayfa başına 1 tane)
  <article>        // Bağımsız içerik (haber)
    <h1>           // Ana başlık (sayfa başına 1 tane)
    <figure>       // Görsel + caption
      <img />
      <figcaption> // Görsel açıklaması
    </figure>
    <time>         // Tarih/zaman
    <section>      // İçerik bölümü
  </article>
  <aside>          // Yan içerik (sidebar)
</aside>
</main>
<footer>           // Site alt bilgi
</footer>

// YANLIS - div soup
<div class="header">
  <div class="nav">...</div>
</div>
<div class="main">
  <div class="article">...</div>
</div>
```

## 2. Başlık Hiyerarşisi

```typescript
// Her sayfada h1-h6 sırası korunmalı, seviye atlanmamalı
<h1>Haber Başlığı</h1>          // Sayfa başına 1 tane
  <h2>Alt Başlık</h2>            // İçerik bölümleri
    <h3>Alt Alt Başlık</h3>
  <h2>Sidebar Başlığı</h2>       // h1 > h3 YAPMA, h2 kullan

// Listeleme sayfalarında
<h1>Teknoloji Haberleri</h1>     // Kategori başlığı
  <h2>Haber Kartı Başlığı</h2>  // Her kart h2
```

## 3. Görsel Erişilebilirliği

```typescript
// Her görselde anlamlı alt text ZORUNLU
<Image
  src={article.cover_image_url}
  alt={article.cover_image_alt || article.title}  // Boş bırakma
  // ...
/>

// Dekoratif görseller (arka plan, ayraç gibi)
<Image src="/divider.svg" alt="" role="presentation" />

// Figure + figcaption
<figure>
  <Image src={url} alt="Deprem bölgesinden görüntü" />
  <figcaption>Kahramanmaraş'ta arama kurtarma çalışmaları</figcaption>
</figure>
```

## 4. Form Erişilebilirliği

```typescript
// Her input'un label'ı olmalı
<div>
  <label htmlFor="title" className="block text-sm font-medium">
    Haber Başlığı <span className="text-red-500" aria-hidden="true">*</span>
    <span className="sr-only">(zorunlu)</span>
  </label>
  <input
    id="title"
    name="title"
    type="text"
    required
    aria-required="true"
    aria-describedby="title-hint title-error"
    className="w-full border rounded px-3 py-2"
  />
  <p id="title-hint" className="text-xs text-gray-500">
    10-200 karakter arası
  </p>
  <p id="title-error" className="text-xs text-red-500" role="alert">
    {errors.title}
  </p>
</div>

// Select
<label htmlFor="category">Kategori</label>
<select id="category" name="category_id" aria-required="true">
  <option value="">Kategori seçin</option>
  {categories.map(c => (
    <option key={c.id} value={c.id}>{c.name}</option>
  ))}
</select>
```

## 5. ARIA Kullanımı

```typescript
// Mobil menü
<button
  aria-label={isOpen ? 'Menüyü kapat' : 'Menüyü aç'}
  aria-expanded={isOpen}
  aria-controls="mobile-menu"
>
  <MenuIcon />
</button>
<nav id="mobile-menu" aria-label="Mobil navigasyon" hidden={!isOpen}>
  ...
</nav>

// Loading durumu
<div aria-busy={isLoading} aria-live="polite">
  {isLoading ? <Spinner /> : <Content />}
</div>

// Bildirimler / Toast
<div role="alert" aria-live="assertive">
  Haber başarıyla yayınlandı.
</div>

// Navigasyon landmark'ları
<nav aria-label="Ana menü">...</nav>
<nav aria-label="Breadcrumb">...</nav>
<nav aria-label="Sayfalama">...</nav>

// Skip link (sayfa başında, ilk tab ile görünür)
<a href="#main-content" className="
  sr-only focus:not-sr-only
  focus:absolute focus:top-4 focus:left-4
  focus:z-50 focus:bg-white focus:px-4 focus:py-2
  focus:shadow-lg focus:rounded
">
  İçeriğe atla
</a>
```

## 6. Klavye Navigasyonu

```typescript
// Tüm interaktif elementler tab ile erişilebilir olmalı
// Focus göstergesi kaldırılmamalı

// YANLIS
className="outline-none"      // Focus göstergesini kaldırma!
className="focus:outline-none" // Sadece özel focus stili ile

// DOGRU
className="focus:outline-2 focus:outline-blue-500 focus:outline-offset-2"
// veya
className="focus-visible:ring-2 focus-visible:ring-blue-500"

// Modal/Dialog
<dialog
  ref={dialogRef}
  className="..."
  onKeyDown={(e) => {
    if (e.key === 'Escape') dialogRef.current?.close()
  }}
>
  {/* Tab trap: focus dialog içinde kalmalı */}
</dialog>
```

## 7. Renk ve Kontrast

```typescript
// WCAG AA: minimum 4.5:1 kontrast oranı (normal metin)
// WCAG AA: minimum 3:1 kontrast oranı (büyük metin, 18px+ veya 14px+ bold)

// DOGRU - yeterli kontrast
className="text-gray-900 bg-white"      // ~21:1
className="text-gray-700 bg-white"      // ~8.6:1
className="text-gray-600 bg-white"      // ~5.7:1

// YANLIS - yetersiz kontrast
className="text-gray-400 bg-white"      // ~3.2:1 (AA fail)
className="text-gray-300 bg-white"      // ~2.1:1 (fail)

// Renk tek başına bilgi taşımamalı
// YANLIS
<span className="text-red-500">Reddedildi</span>

// DOGRU - ikon veya metin ile destekle
<span className="text-red-500 flex items-center gap-1">
  <XCircleIcon className="w-4 h-4" />
  Reddedildi
</span>
```

## 8. sr-only (Screen Reader Only)

```typescript
// Görsel olarak gizle ama screen reader'a oku
<span className="sr-only">Yeni sekmede açılır</span>

// Tailwind sr-only sınıfı
// .sr-only {
//   position: absolute; width: 1px; height: 1px;
//   padding: 0; margin: -1px; overflow: hidden;
//   clip: rect(0,0,0,0); border: 0;
// }
```

## 9. Haber Sayfası Erişilebilirlik Şablonu

```typescript
export default function ArticlePage({ article }: Props) {
  return (
    <>
      <a href="#article-content" className="sr-only focus:not-sr-only">
        Habere atla
      </a>

      <BreadcrumbJsonLd items={breadcrumbs} />

      <nav aria-label="Breadcrumb">
        <ol className="flex gap-2 text-sm">
          {breadcrumbs.map((item, i) => (
            <li key={i}>
              {i < breadcrumbs.length - 1 ? (
                <Link href={item.url}>{item.name}</Link>
              ) : (
                <span aria-current="page">{item.name}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <article id="article-content">
        <header>
          <span className="text-blue-600">{article.category.name}</span>
          <h1>{article.title}</h1>
          <div className="flex items-center gap-4">
            <address className="not-italic">
              <Link href={`/yazar/${article.author.id}`} rel="author">
                {article.author.display_name}
              </Link>
            </address>
            <time dateTime={article.published_at}>
              {formatDate(article.published_at)}
            </time>
          </div>
        </header>

        <figure>
          <Image
            src={article.cover_image_url}
            alt={article.cover_image_alt || article.title}
            width={1200}
            height={630}
            priority
          />
          {article.cover_image_alt && (
            <figcaption>{article.cover_image_alt}</figcaption>
          )}
        </figure>

        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content_html) }}
        />
      </article>
    </>
  )
}
```

## 10. Kontrol Listesi

- [ ] Semantik HTML kullanılıyor (header, nav, main, article, footer)
- [ ] Başlık hiyerarşisi doğru (h1 > h2 > h3, seviye atlanmıyor)
- [ ] Tüm görsellerde alt text var
- [ ] Form elementlerinde label var
- [ ] Klavye ile tüm fonksiyonlara erişilebilir
- [ ] Focus göstergesi görünür
- [ ] Renk kontrastı AA standardını karşılıyor
- [ ] Skip link mevcut
- [ ] ARIA landmark'ları tanımlı
- [ ] Dinamik içerik aria-live ile duyuruluyor
- [ ] Touch hedefleri min 44x44px
- [ ] lang="tr" html tag'inde
