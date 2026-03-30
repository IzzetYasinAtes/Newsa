# Newsa - Supabase Veri Modeli

## ER Diyagramı (Özet)

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│  users   │────<│    articles   │>────│categories│
└──────────┘     └──────┬───────┘     └──────────┘
                        │
                   ┌────┴────┐
                   │         │
            ┌──────▼──┐  ┌───▼─────┐
            │  tags   │  │  media  │
            └─────────┘  └─────────┘
```

## Tablolar

### 1. users (Kullanıcılar/Yazarlar)

Supabase Auth ile entegre. `auth.users` tablosuna ek profil bilgileri tutar.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'author' CHECK (role IN ('admin', 'editor', 'author', 'viewer')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

**Roller**:
- `admin`: Tam yetki
- `editor`: Haber yönetimi, yayınlama yetkisi
- `author`: Kendi haberlerini oluşturma/düzenleme
- `viewer`: Sadece okuma

---

### 2. categories (Kategoriler)

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  parent_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug ON public.categories(slug);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
```

---

### 3. tags (Etiketler)

```sql
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_tags_slug ON public.tags(slug);
```

---

### 4. articles (Haberler)

Ana tablo. Bir haberin tüm bilgilerini tutar.

```sql
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Temel Bilgiler
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,                          -- Kısa özet
  content JSONB,                         -- Rich text (Tiptap JSON formatı)
  content_html TEXT,                     -- Render edilmiş HTML (arama ve SEO için)

  -- Medya
  cover_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  cover_image_alt TEXT,                  -- Erişilebilirlik

  -- Sınıflandırma
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,

  -- Yayın Durumu
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TIMESTAMPTZ,             -- Yayın tarihi (planlı yayın için gelecek tarih)
  archived_at TIMESTAMPTZ,

  -- Öne Çıkarma
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_headline BOOLEAN NOT NULL DEFAULT false,   -- Manşet
  is_breaking BOOLEAN NOT NULL DEFAULT false,   -- Son dakika
  featured_order INTEGER,                        -- Öne çıkan sıralama
  breaking_expires_at TIMESTAMPTZ,               -- Son dakika bitiş zamanı

  -- SEO
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],                   -- Anahtar kelimeler dizisi
  canonical_url TEXT,

  -- Metrikler
  view_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,

  -- Kaynak
  source_name TEXT,                      -- Haber kaynağı
  source_url TEXT,

  -- İçerik Yönetimi
  editor_id UUID REFERENCES public.profiles(id),  -- Düzenleyen editör
  editor_notes TEXT,                               -- Editör notları

  -- Zaman Damgaları
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performans İndeksleri
CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_published ON public.articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_featured ON public.articles(featured_order) WHERE is_featured = true;
CREATE INDEX idx_articles_breaking ON public.articles(created_at DESC) WHERE is_breaking = true;
CREATE INDEX idx_articles_headline ON public.articles(created_at DESC) WHERE is_headline = true;

-- Full-text arama indeksi
CREATE INDEX idx_articles_search ON public.articles
  USING GIN (to_tsvector('turkish', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content_html, '')));
```

---

### 5. article_tags (Haber-Etiket İlişkisi)

```sql
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);
```

---

### 6. media (Medya/Görseller)

```sql
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,               -- Supabase Storage path
  file_url TEXT NOT NULL,                -- Public URL
  file_size INTEGER NOT NULL,            -- Byte cinsinden
  mime_type TEXT NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  caption TEXT,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  folder TEXT DEFAULT 'general',         -- Organizasyon klasörü
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_uploaded_by ON public.media(uploaded_by);
CREATE INDEX idx_media_folder ON public.media(folder);
CREATE INDEX idx_media_mime ON public.media(mime_type);
```

---

### 7. article_media (Haber-Medya İlişkisi - Galeri)

```sql
CREATE TABLE public.article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  UNIQUE(article_id, media_id)
);

CREATE INDEX idx_article_media_article ON public.article_media(article_id);
```

---

### 8. related_articles (İlgili Haberler)

```sql
CREATE TABLE public.related_articles (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  related_article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (article_id, related_article_id),
  CHECK (article_id != related_article_id)
);
```

---

### 9. settings (Site Ayarları)

```sql
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id)
);
```

---

### 10. audit_logs (Denetim Kayıtları)

```sql
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,                  -- 'create', 'update', 'delete', 'publish', 'archive'
  entity_type TEXT NOT NULL,             -- 'article', 'category', 'tag', 'media', 'user'
  entity_id UUID NOT NULL,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);
```

---

## Row Level Security (RLS) Politikaları

### articles
```sql
-- Herkes yayınlanmış haberleri okuyabilir
CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' AND published_at <= now());

-- Yazarlar kendi haberlerini yönetebilir
CREATE POLICY "Authors can manage own articles"
  ON public.articles FOR ALL
  USING (auth.uid() = author_id);

-- Editörler tüm haberleri yönetebilir
CREATE POLICY "Editors can manage all articles"
  ON public.articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
```

### media
```sql
-- Herkes medyayı görüntüleyebilir
CREATE POLICY "Public can view media"
  ON public.media FOR SELECT
  USING (true);

-- Auth kullanıcılar medya yükleyebilir
CREATE POLICY "Auth users can upload media"
  ON public.media FOR INSERT
  WITH CHECK (auth.uid() = uploaded_by);
```

## Database Functions

### updated_at Trigger
```sql
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Her tabloya uygula
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
```

### Slug Üretimi
```sql
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(title);
  -- Türkçe karakterleri dönüştür
  slug := replace(slug, 'ç', 'c');
  slug := replace(slug, 'ğ', 'g');
  slug := replace(slug, 'ı', 'i');
  slug := replace(slug, 'ö', 'o');
  slug := replace(slug, 'ş', 's');
  slug := replace(slug, 'ü', 'u');
  -- Özel karakterleri kaldır, boşlukları tire yap
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;
```

### View Count Artırma
```sql
CREATE OR REPLACE FUNCTION public.increment_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Supabase Storage Buckets

| Bucket | Erişim | Açıklama |
|--------|--------|----------|
| `articles` | Public | Haber görselleri |
| `avatars` | Public | Kullanıcı avatarları |
| `media` | Public | Genel medya dosyaları |
