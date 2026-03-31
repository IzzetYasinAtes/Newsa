-- Manset siralama kolonu ekleme
-- Manset sayfasi headline_order kolonunu sorguluyor ancak kolon eksikti
ALTER TABLE articles ADD COLUMN IF NOT EXISTS headline_order integer;

-- Mevcut manset haberlere siralama ata
UPDATE articles SET headline_order = 1 WHERE id = 'f0000000-0000-0000-0000-000000000001' AND is_headline = true;
UPDATE articles SET headline_order = 2 WHERE id = 'f0000000-0000-0000-0000-000000000002' AND is_headline = true;
UPDATE articles SET headline_order = 3 WHERE id = 'f0000000-0000-0000-0000-000000000003' AND is_headline = true;
UPDATE articles SET headline_order = 4 WHERE id = 'f0000000-0000-0000-0000-000000000004' AND is_headline = true;
UPDATE articles SET headline_order = 5 WHERE id = 'f0000000-0000-0000-0000-000000000005' AND is_headline = true;
