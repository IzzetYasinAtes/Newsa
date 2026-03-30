# Nevsa Admin - Yönetim Paneli

## Amaç
Editör ekibi için haber, kategori, medya, kullanıcı ve site yönetimi sağlayan admin paneli.

## Teknik Kurallar
- **Rendering**: Client-side ağırlıklı (interaktif panel)
- **Auth**: Tüm sayfalar protected, login hariç
- **RBAC**: Rol bazlı erişim kontrolü (admin, editor, author)
- **Port**: 3001

## Sayfa Yapısı
```
src/app/
├── login/page.tsx                    # Giriş sayfası
├── (dashboard)/
│   ├── layout.tsx                    # Sidebar + topbar layout
│   ├── page.tsx                      # Dashboard
│   ├── haberler/
│   │   ├── page.tsx                  # Haber listesi
│   │   ├── yeni/page.tsx             # Yeni haber
│   │   └── [id]/page.tsx             # Haber düzenleme
│   ├── kategoriler/page.tsx          # Kategori yönetimi
│   ├── etiketler/page.tsx            # Etiket yönetimi
│   ├── medya/page.tsx                # Medya kütüphanesi
│   ├── kullanicilar/page.tsx         # Kullanıcı yönetimi
│   └── ayarlar/page.tsx              # Site ayarları
```

## Bağımlılıklar
- `@newsa/shared` - Tipler ve utility'ler
- `@newsa/supabase` - Veri erişimi
- `@newsa/ui` - Paylaşılan bileşenler
- Rich text editör (Tiptap)
