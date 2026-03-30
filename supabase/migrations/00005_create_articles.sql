CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  content JSONB,
  content_html TEXT,
  cover_image_id UUID REFERENCES public.media(id) ON DELETE SET NULL,
  cover_image_alt TEXT,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
  published_at TIMESTAMPTZ,
  archived_at TIMESTAMPTZ,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_headline BOOLEAN NOT NULL DEFAULT false,
  is_breaking BOOLEAN NOT NULL DEFAULT false,
  featured_order INTEGER,
  breaking_expires_at TIMESTAMPTZ,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,
  view_count INTEGER NOT NULL DEFAULT 0,
  share_count INTEGER NOT NULL DEFAULT 0,
  source_name TEXT,
  source_url TEXT,
  editor_id UUID REFERENCES public.profiles(id),
  editor_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_articles_slug ON public.articles(slug);
CREATE INDEX idx_articles_status ON public.articles(status);
CREATE INDEX idx_articles_category ON public.articles(category_id);
CREATE INDEX idx_articles_author ON public.articles(author_id);
CREATE INDEX idx_articles_published ON public.articles(published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_featured ON public.articles(featured_order) WHERE is_featured = true;
CREATE INDEX idx_articles_breaking ON public.articles(created_at DESC) WHERE is_breaking = true;
CREATE INDEX idx_articles_headline ON public.articles(created_at DESC) WHERE is_headline = true;

CREATE INDEX idx_articles_search ON public.articles
  USING GIN (to_tsvector('turkish', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(content_html, '')));

ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles"
  ON public.articles FOR SELECT
  USING (status = 'published' AND published_at <= now());

CREATE POLICY "Authors can manage own articles"
  ON public.articles FOR ALL
  USING (auth.uid() = author_id);

CREATE POLICY "Editors can manage all articles"
  ON public.articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('admin', 'editor')
    )
  );
