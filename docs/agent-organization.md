# Agent Organizasyonu

## Genel Yapı

```
                    ┌────────────────────┐
                    │   Kullanıcı (Ben)  │
                    └─────────┬──────────┘
                              │
                    ┌─────────▼──────────┐
                    │  Project Manager   │
                    │      Agent         │
                    └──┬──────┬───────┬──┘
                       │      │       │
              ┌────────▼┐  ┌──▼────┐ ┌▼─────────┐
              │ Analyst  │  │ Dev   │ │ Tester   │
              │ Agent    │  │ Agent │ │ Agent    │
              └──────────┘  └───────┘ └──────────┘
```

## Agent Rolleri ve Sorumlulukları

### 1. Project Manager Agent

**Dosya**: `.claude/agents/project-manager.md`

**Sorumluluklar**:
- Kullanıcıdan gelen istekleri proje görevlerine çevirme
- Master plan oluşturma ve güncelleme
- Sprint planlama ve backlog yönetimi
- Görev dağıtımı ve önceliklendirme
- İlerleme takibi ve raporlama
- Agent'lar arası koordinasyon
- Escalation yönetimi
- Risk takibi

**Karar Yetkileri**:
- Hangi görevi hangi agent'a atayacağına karar verir
- Sprint kapsamını belirler
- Önceliklendirme yapar
- Planı günceller

**MCP Kullanımı**:
- Supabase MCP: Genel şema durumunu kontrol etmek
- Playwright MCP: Tamamlanan özellikleri doğrulamak

**Tetiklenme Koşulları**:
- Yeni bir özellik isteği geldiğinde
- Sprint planlaması gerektiğinde
- İlerleme raporu istendiğinde
- Agent'lar arasında çakışma olduğunda

---

### 2. Analyst Agent

**Dosya**: `.claude/agents/analyst.md`

**Sorumluluklar**:
- İhtiyaç analizi ve gereksinim çıkarma
- Feature tanımları ve acceptance criteria yazma
- Veri modeli tasarımı
- Kullanıcı akışları ve senaryolar
- Sayfa/modül bazlı detaylı spesifikasyonlar
- SEO gereksinimleri
- API endpoint tanımları

**Karar Yetkileri**:
- Gereksinim detaylarını belirler
- Veri modeli önerir
- Kullanıcı akışını tasarlar
- Eksik gereksinimleri tespit eder

**MCP Kullanımı**:
- Supabase MCP: Mevcut şemayı incelemek, veri modeli doğrulamak
- Playwright MCP: Referans siteleri incelemek

**Tetiklenme Koşulları**:
- Yeni bir modül/özellik planlanırken
- Gereksinimler belirsiz olduğunda
- Veri modeli tasarımı gerektiğinde
- PM agent eksik gereksinim tespit ettiğinde

---

### 3. Developer Agent

**Dosya**: `.claude/agents/developer.md`

**Sorumluluklar**:
- Kod üretimi (component, sayfa, API, migration)
- Monorepo yapılandırması
- Supabase entegrasyonları
- UI implementasyonu
- API endpoint implementasyonu
- Paylaşılan paket geliştirme
- Code review standartları uygulama

**Karar Yetkileri**:
- Teknik implementasyon detayları
- Library/paket seçimleri (PM onayı ile)
- Kod yapısı ve pattern'ler
- Performance optimizasyonu kararları

**MCP Kullanımı**:
- Supabase MCP: Migration oluşturma, şema güncelleme, veri sorgulama
- Playwright MCP: Geliştirme sırasında görsel doğrulama

**Tetiklenme Koşulları**:
- Analiz tamamlanıp implementasyona geçildiğinde
- Bug fix gerektiğinde
- Refactoring planlandığında
- Teknik altyapı kurulumu gerektiğinde

---

### 4. Tester Agent

**Dosya**: `.claude/agents/tester.md`

**Sorumluluklar**:
- Test planı oluşturma
- E2E test yazma (Playwright)
- Smoke test yürütme
- Regression test
- API test
- Bug raporu oluşturma
- Test sonuçlarını raporlama

**Karar Yetkileri**:
- Test kapsamı ve önceliği
- Test senaryoları
- Bug severity belirleme
- Test ortamı yapılandırması

**MCP Kullanımı**:
- Playwright MCP: E2E testler, ekran doğrulama, görsel regresyon
- Supabase MCP: Test verisi oluşturma, veritabanı durumu doğrulama

**Tetiklenme Koşulları**:
- Bir özellik implementasyonu tamamlandığında
- Sprint sonu regression testi
- Deploy öncesi smoke test
- Bug raporu doğrulama

---

## Agent'lar Arası İletişim Modeli

### İş Akışı

```
1. Kullanıcı → PM: "Haber yönetimi modülünü yap"
2. PM → Analyst: "Haber yönetimi gereksinimlerini çıkar"
3. Analyst → PM: Gereksinim dokümanı + acceptance criteria
4. PM → Developer: "Bu gereksinimlere göre implementasyonu yap"
5. Developer → PM: "İmplementasyon tamamlandı"
6. PM → Tester: "Bu özellikleri test et"
7. Tester → PM: Test raporu
8. PM → Kullanıcı: İlerleme raporu
```

### Escalation Kuralları

| Durum | Escalation |
|-------|-----------|
| Gereksinim belirsiz | Developer → PM → Analyst |
| Teknik engel | Developer → PM → Kullanıcı |
| Test başarısız | Tester → PM → Developer |
| Kapsam değişikliği | Analyst → PM → Kullanıcı |
| Kritik bug | Tester → PM → Developer (öncelikli) |

### Görev Devri Kuralları

1. Her görev açık bir **acceptance criteria** ile devredilir
2. Devralan agent işi kabul etmeden önce gereksinimleri doğrular
3. Tamamlanan iş bir sonraki agent'a **çıktı dokümanı** ile devredilir
4. Her devir noktasında PM bilgilendirilir
5. Blocker durumlarında PM müdahale eder

## Agent Seçim Matrisi

| Görev Türü | Birincil Agent | Destek Agent |
|-----------|---------------|-------------|
| Yeni özellik planlama | PM + Analyst | - |
| Gereksinim detaylandırma | Analyst | PM |
| Veri modeli tasarımı | Analyst | Developer |
| Kod yazma | Developer | - |
| Migration oluşturma | Developer | Analyst |
| UI implementasyonu | Developer | - |
| API implementasyonu | Developer | Analyst |
| Test yazma | Tester | Developer |
| Bug fix | Developer | Tester |
| Sprint planlama | PM | Analyst |
| Deploy | Developer | Tester |
| Performans iyileştirme | Developer | Tester |
