-- updated_at otomatik güncelleme trigger'ı
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Slug üretimi (Türkçe karakter desteği)
CREATE OR REPLACE FUNCTION public.generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(title);
  slug := replace(slug, 'ç', 'c');
  slug := replace(slug, 'ğ', 'g');
  slug := replace(slug, 'ı', 'i');
  slug := replace(slug, 'ö', 'o');
  slug := replace(slug, 'ş', 's');
  slug := replace(slug, 'ü', 'u');
  slug := replace(slug, 'Ç', 'c');
  slug := replace(slug, 'Ğ', 'g');
  slug := replace(slug, 'İ', 'i');
  slug := replace(slug, 'Ö', 'o');
  slug := replace(slug, 'Ş', 's');
  slug := replace(slug, 'Ü', 'u');
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Görüntülenme sayacı
CREATE OR REPLACE FUNCTION public.increment_view_count(p_article_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.articles
  SET view_count = view_count + 1
  WHERE id = p_article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
