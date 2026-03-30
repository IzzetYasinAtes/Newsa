# Haber Entity Spesifikasyonu

> Analyst Agent tarafından hazırlanan, bir haberin uçtan uca sahip olması gereken tüm alan ve davranışların detaylı tanımı.

## 1. Temel Alanlar

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `title` | Text | Evet | Haber başlığı (max 200 karakter) |
| `summary` | Text | Hayır | Kısa özet/spot (max 500 karakter, listeleme ve SEO description için) |
| `content` | JSONB | Evet | Zengin metin içeriği (Tiptap JSON formatı) |
| `content_html` | Text | Otomatik | Content'ten render edilen HTML (arama indeksi ve API için) |

### Başlık Kuralları
- Minimum 10, maksimum 200 karakter
- SEO title boşsa başlık kullanılır
- Başlık değiştiğinde slug otomatik güncellenmez (elle kontrol)

### İçerik Editörü Desteklenmesi Gerekenler
- Paragraf, başlık (H2, H3, H4)
- Kalın, italik, altı çizili, üstü çizili
- Sıralı ve sırasız listeler
- Blockquote
- Görsel ekleme (inline)
- Video embed (YouTube, Twitter)
- Link ekleme
- Tablo
- Kod bloğu (isteğe bağlı)
- Ayraç (horizontal rule)

---

## 2. Medya Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `cover_image_id` | UUID (FK) | Hayır (yayın için evet) | Kapak görseli |
| `cover_image_alt` | Text | Hayır | Kapak görseli alt metni (erişilebilirlik) |
| `gallery` | article_media[] | Hayır | Haber galerisi (ek görseller) |

### Kapak Görseli Kuralları
- Yayınlama için kapak görseli zorunlu
- Önerilen boyut: 1200x630px (OG image uyumlu)
- Desteklenen formatlar: JPEG, PNG, WebP
- Maksimum dosya boyutu: 5MB
- Otomatik WebP dönüşümü (Next.js Image)
- Responsive boyutlar otomatik üretilir

### Galeri
- Sıralama destekler (sort_order)
- Her görsele caption eklenebilir
- Lightbox görünümü (web)
- Slider görünümü (mobil)

---

## 3. Sınıflandırma Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `category_id` | UUID (FK) | Evet | Ana kategori |
| `tags` | article_tags[] | Hayır | Etiketler (çoklu) |

### Kategori Kuralları
- Her haber tam olarak 1 kategoriye ait olmalı
- Kategoriler hiyerarşik olabilir (parent_id)
- Kategori silinirse haberler taşınmalı (restrict)

### Etiket Kuralları
- Bir habere birden fazla etiket eklenebilir
- Etiketler otomatik tamamlama ile seçilir
- Yeni etiket inline oluşturulabilir
- Etiketler URL-friendly slug'a sahip

---

## 4. Yazar ve Düzenleme Bilgileri

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `author_id` | UUID (FK) | Evet | Haberi yazan |
| `editor_id` | UUID (FK) | Hayır | Son düzenleyen editör |
| `editor_notes` | Text | Hayır | Editör notları (sadece admin panelde görünür) |

### Yazar Kuralları
- Yazar, haberi oluşturan kullanıcıdır
- Admin/editör başka bir yazarı atayabilir
- Yazar sayfasında tüm haberleri listelenir
- Yazar bilgisi haber detayında gösterilir (avatar, isim, bio)

### Düzenleme Süreci
1. Yazar haberi oluşturur → status: `draft`
2. Yazar "İncelemeye Gönder" yapar → status: `review`
3. Editör inceler, gerekirse not ekler
4. Editör onaylarsa → status: `published`
5. Editör reddederse → status: `draft` (notlarla birlikte)

---

## 5. Yayın Durumu ve Zamanlama

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `status` | Enum | Evet | `draft`, `review`, `published`, `archived` |
| `published_at` | Timestamptz | Hayır | Yayın tarihi |
| `archived_at` | Timestamptz | Hayır | Arşivlenme tarihi |

### Durum Geçişleri
```
draft ──→ review ──→ published ──→ archived
  ↑          │            │
  └──────────┘            │
  (reddedildi)            │
  ↑                       │
  └───────────────────────┘
  (yeniden düzenleme)
```

### Planlı Yayın
- `published_at` gelecek bir tarih olarak ayarlanabilir
- Status `published` yapılır ama `published_at` gelecekte ise sitede görünmez
- Cron job veya Supabase Edge Function ile kontrol edilir
- Planlı haberler admin panelde ayrı listelenir

---

## 6. Öne Çıkarma Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `is_featured` | Boolean | Hayır | Öne çıkan haber |
| `is_headline` | Boolean | Hayır | Manşet haberi |
| `is_breaking` | Boolean | Hayır | Son dakika haberi |
| `featured_order` | Integer | Hayır | Öne çıkan sıralama |
| `breaking_expires_at` | Timestamptz | Hayır | Son dakika bitiş zamanı |

### Öne Çıkan Haber Kuralları
- Anasayfada öne çıkan bölümde gösterilir
- `featured_order` ile sıralama belirlenir
- Maksimum 5-10 öne çıkan haber (ayarlanabilir)

### Manşet Kuralları
- Anasayfanın en üstünde büyük formatta gösterilir
- Aynı anda 1-3 manşet haberi olabilir (slider)
- Editör tarafından manuel seçilir

### Son Dakika Kuralları
- Sitenin üstünde kayan bant olarak gösterilir
- Otomatik bitiş süresi: `breaking_expires_at` (varsayılan 4 saat)
- Süresi dolunca otomatik kapanır
- Push notification tetikleyebilir (Faz 3)

---

## 7. SEO Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `slug` | Text | Evet (otomatik) | URL-friendly tanımlayıcı |
| `seo_title` | Text | Hayır | Özel SEO başlığı (yoksa title kullanılır) |
| `seo_description` | Text | Hayır | Meta description (yoksa summary kullanılır) |
| `seo_keywords` | Text[] | Hayır | Meta keywords |
| `canonical_url` | Text | Hayır | Canonical URL (harici kaynak için) |

### Slug Kuralları
- Başlıktan otomatik üretilir (Türkçe karakter dönüşümü ile)
- Manuel düzenlenebilir
- Benzersiz olmalı (unique constraint)
- Değiştirilirse eski slug'dan redirect olmalı (301)
- Format: `/haber/{slug}` veya `/{category-slug}/{slug}`

### SEO Gereksinimleri
- Open Graph meta tag'leri (og:title, og:description, og:image)
- Twitter Card meta tag'leri
- JSON-LD yapısal veri (NewsArticle schema)
- Canonical URL
- Sitemap.xml otomatik güncelleme
- robots.txt

### JSON-LD Örneği
```json
{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Haber Başlığı",
  "description": "Haber özeti",
  "image": "https://...",
  "datePublished": "2024-01-01T00:00:00Z",
  "dateModified": "2024-01-01T00:00:00Z",
  "author": {
    "@type": "Person",
    "name": "Yazar Adı"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Newsa",
    "logo": { "@type": "ImageObject", "url": "https://..." }
  }
}
```

---

## 8. Metrik Alanları

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `view_count` | Integer | Otomatik | Görüntülenme sayısı |
| `share_count` | Integer | Otomatik | Paylaşım sayısı |

### Metrik Kuralları
- View count her sayfa yüklemesinde artırılır
- Duplicate view'ları önlemek için session bazlı kontrol (gelecekte)
- Share count sosyal paylaşım butonları üzerinden artırılır
- Admin panelde en çok okunan/paylaşılan haberler raporlanır

---

## 9. Kaynak Bilgisi

| Alan | Tip | Zorunlu | Açıklama |
|------|-----|---------|----------|
| `source_name` | Text | Hayır | Haber kaynağı adı |
| `source_url` | Text | Hayır | Kaynak URL |

### Kaynak Kuralları
- Alıntı haberlerde kaynak belirtilmeli
- Kaynak URL nofollow olarak işaretlenir
- Haber detayında kaynak bilgisi gösterilir

---

## 10. İlgili Haberler

`related_articles` tablosu üzerinden yönetilir.

### Kurallar
- Manuel olarak editör tarafından seçilebilir
- Otomatik öneri: aynı kategori + benzer etiketler (Faz 2)
- Haber detay sayfasının altında gösterilir
- Maksimum 4-6 ilgili haber

---

## 11. Sosyal Paylaşım

Veritabanında ayrı alan tutulmaz, frontend'de implementasyon:
- Facebook paylaşım butonu
- Twitter/X paylaşım butonu
- WhatsApp paylaşım butonu
- LinkedIn paylaşım butonu
- Link kopyalama butonu
- Paylaşım URL'i: `{site_url}/{category-slug}/{slug}`

---

## 12. Admin Panel Haber Formu Alanları

```
┌─────────────────────────────────────────────────────┐
│ Haber Düzenleme                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Başlık: [________________________]                  │
│                                                     │
│ Özet:   [________________________]                  │
│         [________________________]                  │
│                                                     │
│ İçerik: ┌──────────────────────────┐               │
│         │ Rich Text Editor         │               │
│         │                          │               │
│         │                          │               │
│         └──────────────────────────┘               │
│                                                     │
│ ─── Medya ───                                      │
│ Kapak Görseli: [Yükle] [Galeriden Seç]             │
│ Alt Metin:     [________________________]           │
│ Galeri:        [Görselleri Yönet]                   │
│                                                     │
│ ─── Sınıflandırma ───                              │
│ Kategori:  [Dropdown ▼]                            │
│ Etiketler: [Tag1] [Tag2] [+ Ekle]                  │
│                                                     │
│ ─── SEO ───                                        │
│ Slug:            [auto-generated-slug]              │
│ SEO Başlık:      [________________________]         │
│ SEO Açıklama:    [________________________]         │
│ SEO Keywords:    [________________________]         │
│ Canonical URL:   [________________________]         │
│                                                     │
│ ─── Yayın ───                                      │
│ Durum:       [Draft ▼]                             │
│ Yayın Tarihi:[📅 Tarih Seçici]                     │
│ Yazar:       [Dropdown ▼]                          │
│                                                     │
│ ─── Öne Çıkarma ───                                │
│ [☐] Öne Çıkan  [☐] Manşet  [☐] Son Dakika         │
│                                                     │
│ ─── Kaynak ───                                     │
│ Kaynak Adı:  [________________________]             │
│ Kaynak URL:  [________________________]             │
│                                                     │
│ ─── Editör ───                                     │
│ Editör Notları: [________________________]          │
│                                                     │
│           [Taslak Kaydet]  [Yayınla]               │
└─────────────────────────────────────────────────────┘
```

## 13. Haber Durumlarına Göre Erişim Matrisi

| İşlem | Admin | Editör | Yazar |
|-------|-------|--------|-------|
| Oluşturma | ✅ | ✅ | ✅ |
| Kendi haberini düzenleme | ✅ | ✅ | ✅ (sadece draft/review) |
| Başka haberini düzenleme | ✅ | ✅ | ❌ |
| İncelemeye gönderme | ✅ | ✅ | ✅ |
| Yayınlama | ✅ | ✅ | ❌ |
| Arşivleme | ✅ | ✅ | ❌ |
| Silme | ✅ | ❌ | ❌ |
| Öne çıkarma | ✅ | ✅ | ❌ |
| Manşete alma | ✅ | ✅ | ❌ |
| Son dakika yapma | ✅ | ✅ | ❌ |
