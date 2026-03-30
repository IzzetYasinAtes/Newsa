-- Haber-Etiket ilişkisi
CREATE TABLE public.article_tags (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

CREATE INDEX idx_article_tags_tag ON public.article_tags(tag_id);

ALTER TABLE public.article_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article tags are viewable by everyone"
  ON public.article_tags FOR SELECT
  USING (true);

CREATE POLICY "Auth users can manage article tags"
  ON public.article_tags FOR ALL
  USING (auth.uid() IS NOT NULL);

-- Haber-Medya ilişkisi (Galeri)
CREATE TABLE public.article_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  media_id UUID NOT NULL REFERENCES public.media(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  caption TEXT,
  UNIQUE(article_id, media_id)
);

CREATE INDEX idx_article_media_article ON public.article_media(article_id);

ALTER TABLE public.article_media ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Article media is viewable by everyone"
  ON public.article_media FOR SELECT
  USING (true);

CREATE POLICY "Auth users can manage article media"
  ON public.article_media FOR ALL
  USING (auth.uid() IS NOT NULL);

-- İlgili Haberler
CREATE TABLE public.related_articles (
  article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  related_article_id UUID NOT NULL REFERENCES public.articles(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (article_id, related_article_id),
  CHECK (article_id != related_article_id)
);

ALTER TABLE public.related_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Related articles are viewable by everyone"
  ON public.related_articles FOR SELECT
  USING (true);

CREATE POLICY "Auth users can manage related articles"
  ON public.related_articles FOR ALL
  USING (auth.uid() IS NOT NULL);
