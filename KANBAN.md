# FUDI — Kanban-Board

> Visuelle Todo-Liste. Detaillierte Begründung/Aufwand: `PRODUCT_ROADMAP.md`.

## ✅ Done
- [x] AGB-Seite erstellt & geroutet (Rechtliches)
- [x] Cookie-Richtlinie erstellt & geroutet
- [x] Footer-Links (Landing + Layout) auf echte Routen
- [x] **1** Bundle-Optimierung · _per `vite build` verifiziert: recipesDatabase = eigener Chunk (118 kB gzip), Initial nur 102 kB gzip_
- [x] **2** UX: 8× `alert()` → Toast/Modal · _`src/lib/toast.tsx`, in `main.tsx` gemountet, alle Stellen ersetzt, `tsc` clean_
- [x] **3** PWA/offline · _`manifest.webmanifest` + `sw.js` (network-first nav, cache-first statisch, skipped lazy Recipe-DB) + SVG-Icons, in `dist/` verifiziert_
- [x] **4** Auth-Adapter · _`src/lib/authAdapter.ts` kapselt login/register/logout/getSession; Supabase-Swap via `setAuthAdapter()` ohne UI-Änderung; 4 Tests_
- [x] **5** DSGVO-Datenexport (JSON) · _`src/lib/dataExport.ts` über alle 6 `fudi_*`-Keys, in Profile verdrahtet; 6 Tests_
- [x] **6** Production-Logging · _`api/_log.js` env-gated, webhooks loggt nur Stripe-IDs (kein PII)_

## 🔄 In Progress
- [ ] **7** Tests erweitern (Data-Export ✅, Auth-Adapter ✅, Entitlement-Guard ⏳) · _bisher 37 Tests grün_

## ⛔ Blocked (Welle 2 — braucht deinen Input)
- [ ] **8** Supabase-Projekt + DB-Schema + RLS · _blockiert: Supabase-Account_
- [ ] **9** Auth-Migration localStorage → Supabase · _blockiert: #8_
- [ ] **10** Kern-Daten serverseitig persistieren · _blockiert: #8, #9_
- [ ] **11** Entitlements: Stripe-Webhook → DB → PRO sperren · _blockiert: Stripe-Keys, #8_
- [ ] **12** Echtes „Account & Daten löschen" · _blockiert: #8_
- [ ] **13** Impressum/AGB mit echten Daten + Widerruf · _blockiert: Firmendaten, Anwalt_
- [ ] **14** DPA/AV-Vertrag mit Supabase · _blockiert: Vertrag_
- [ ] **15** Error-Tracking (Sentry) + Analytics · _blockiert: Accounts_

## 🌱 Backlog (Welle 3 — Wachstum)
- [ ] **16** E-Mail-Automation (Trial-Ende, Win-back)
- [ ] **17** SEO/Content für Rezepte & Saisonales
- [ ] **18** Onboarding-Funnel messen & optimieren

## 🛒 Welle 4 — Wochenplaner, No-Waste, Preise & Shops (neu)
- [ ] **19** `src/lib/weekPlanner.ts` anlegen: Interfaces + `generateWeekPlan()` (max. 3 Rezepte/Woche, Diät, Allergien, Prioritäten)
- [ ] **20** `src/data/priceIndex.ts` anlegen: manueller Preisindex (Zutat, Preis, Einheit, Shop, Rabatt)
- [ ] **21** No-Waste-Logik: gleiche Zutat über mehrere Gerichte planen, Resteverwertungs-Tipp
- [ ] **22** Einkaufsliste aggregieren + Gesamtpreis pro Shop kalkulieren
- [ ] **23** `UserPreferences`: diet, allergies, budget/woche, priorities[], noWaste, householdSize, plz
- [ ] **24** Shops modellieren (REWE, EDEKA, Picnic, Alnatura, lokaler Markt) mit PLZ-Zuordnung
- [ ] **25** UI: WeekPlanner-Seite (`/planer`) mit den 3 Vorschlägen und Einkaufsliste verbinden
- [ ] **26** Zutatenalternativen (`src/data/ingredientSubstitutes.ts`) für Allergien/Ersatz

## ⚠️ Preise ohne offizielle API — Konzept
- [ ] **27** Preise über JSON/CSV pflegen (manuell oder regelmäßiger Import) — realistisch ohne API
- [ ] **28** Nutzer kann eigene Preise eintragen (Crowdsourcing innerhalb der App)
- [ ] **29** Öffentliche Prospekte scrapen — NICHT empfohlen (ToS, Urheberrecht, Captcha, Login, dynamische Inhalte)
- [ ] **30** Offizielle Partner-APIs anfragen (Rewe, Edeka, Picnic) — langfristig sauberster Weg
- [ ] **31** Rabatt-Flag in Preisindex + Anzeige im WeekPlanner

## 🚀 Push-Befehle (von dir auszuführen)
```powershell
cd g:\FUDI\Webseite
git add src\pages\RecipeDetail.tsx src\lib\flavorBalance.ts src\lib\weekPlanner.ts KANBAN.md
git commit -m "feat: weekPlanner Grundgerüst, flavorBalance Herkunfts-Bug fix, RecipeDetail Badges + Import-Dedup"
git push origin main
```
