import FridgeScannerModal from "../components/FridgeScannerModal";
import { useState, useMemo } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

const MEAL_TYPES = ["Alle", "Frühstück", "Mittag", "Abendessen", "Snack", "Pre-Workout", "Post-Workout"];
const DIETS = ["Alle", "High Protein", "Low Carb", "Keto", "Vegan", "Vegetarisch", "Glutenfrei", "Paleo"];
const ALLERGIES = ["Alle", "Glutenfrei", "Laktosefrei", "Nussfrei", "Histaminarm"];
const VITAMINS = ["Alle", "B12 & Eisen", "Omega-3 & Cholin", "Vitamin C & Zink", "Magnesium & Kalium", "Sulforaphan & Antioxidantien", "Präbiotische Ballaststoffe", "D3, K2 & Calcium"];
const COUNTRIES = ["Alle", "Japan", "Italien", "Griechenland", "Mexiko", "Indien", "Thailand", "Spanien", "Marokko", "Schweden", "Georgien", "Peru", "Frankreich", "Deutschland", "USA", "Korea", "Brasilien"];
const TIMES = ["Alle", "< 15 min", "< 25 min", "< 40 min"];

function GIBadge({ gi }: { gi: string }) {
  const color = gi === "low" ? C.mint : C.coral;
  const label = gi === "low" ? "Low GI" : "Med GI";
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs" style={{ background: color }}>
      {label}
    </span>
  );
}

function RecipeCard({ r }: { r: RecipeItem }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg relative flex flex-col justify-between"
      style={{ borderColor: C.border }}>
      <div>
        <div className="relative h-44 overflow-hidden bg-gray-100">
          <img src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
          <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white shadow-sm" style={{ background: C.forest }}>
              {r.country}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/90 text-gray-800 shadow-sm">
              {r.diet}
            </span>
          </div>
          <div className="absolute top-3 right-3 flex gap-1.5">
            <GIBadge gi={r.gi} />
            <button onClick={() => setSaved(!saved)}
              className="w-7 h-7 rounded-full bg-white/90 flex items-center justify-center text-xs shadow-sm hover:scale-110 transition-transform"
              style={{ color: saved ? C.coral : C.stone }}>
              {saved ? "♥" : "♡"}
            </button>
          </div>
          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center text-[10px] font-semibold px-2.5 py-1 rounded-lg bg-black/60 text-white backdrop-blur-xs">
            <span>⏱ {r.time} Min.</span>
            <span>★ {r.rating.toFixed(1)}</span>
            <span>🧬 {r.organ}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded" style={{ background: C.cream, color: C.stone }}>
              {r.tag}
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              {r.vitamins}
            </span>
          </div>

          <Link to={`/recipe/${r.id}`} className="font-bold text-sm leading-snug line-clamp-2 hover:underline block mb-2"
            style={{ color: C.forest }}>
            {r.title}
          </Link>

          <p className="text-[11px] text-gray-500 italic line-clamp-2 mb-3">
            💡 {r.chefTip}
          </p>

          <div className="grid grid-cols-4 gap-1 text-center py-2 px-1 rounded-xl bg-gray-50 border border-gray-100 text-[11px]">
            <div>
              <p className="font-bold text-gray-800">{r.kcal}</p>
              <p className="text-[9px] text-gray-400">kcal</p>
            </div>
            <div>
              <p className="font-bold text-emerald-700">{r.protein}g</p>
              <p className="text-[9px] text-gray-400">Protein</p>
            </div>
            <div>
              <p className="font-bold text-amber-600">{r.carbs}g</p>
              <p className="text-[9px] text-gray-400">Carbs</p>
            </div>
            <div>
              <p className="font-bold text-rose-600">{r.fat}g</p>
              <p className="text-[9px] text-gray-400">Fett</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 pt-1 flex justify-between items-center border-t border-gray-100">
        <span className="text-[10px] text-gray-400">
          Blutzucker-Impact: <strong className="text-gray-700">+{r.impact} mg/dL</strong>
        </span>
        <Link to={`/recipe/${r.id}`}
          className="text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
          style={{ background: C.mint }}>
          Kochen →
        </Link>
      </div>
    </div>
  );
}

export default function RecipeSearch() {
  const [scannerOpen, setScannerOpen] = useState(false);
  const [search, setSearch]           = useState("");
  const [mealType, setMealType]       = useState("Alle");
  const [diet, setDiet]               = useState("Alle");
  const [allergy, setAllergy]         = useState("Alle");
  const [vitamin, setVitamin]         = useState("Alle");
  const [country, setCountry]         = useState("Alle");
  const [time, setTime]               = useState("Alle");
  const [page, setPage]               = useState(1);
  const pageSize                      = 24;

  const filtered = useMemo(() => {
    return RECIPES_DB.filter(r => {
      if (mealType !== "Alle" && r.tag !== mealType) return false;
      if (diet !== "Alle" && r.diet !== diet) return false;
      if (allergy !== "Alle" && !r.allergies.includes(allergy)) return false;
      if (vitamin !== "Alle" && r.vitamins !== vitamin) return false;
      if (country !== "Alle" && r.country !== country) return false;
      if (time === "< 15 min" && r.time >= 15) return false;
      if (time === "< 25 min" && r.time >= 25) return false;
      if (time === "< 40 min" && r.time >= 40) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          r.title.toLowerCase().includes(q) ||
          r.country.toLowerCase().includes(q) ||
          r.vitamins.toLowerCase().includes(q) ||
          r.organ.toLowerCase().includes(q) ||
          r.diet.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [mealType, diet, allergy, vitamin, country, time, search]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  return (
    <div className="min-h-screen pb-16" style={{ background: C.bg }}>
      <FridgeScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      {/* Header */}
      <div className="bg-white border-b px-4 py-8 shadow-xs" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white" style={{ background: C.mint }}>
                {filtered.length.toLocaleString("de-DE")} Rezepte verfügbar
              </span>
              <span className="text-xs text-gray-500">· Weltweite Diäten &amp; Nährstoffprofile</span>
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: C.forest }}>
              Rezept-Datenbank &amp; Ernährungs-Scout
            </h1>
            <p className="text-sm mt-1" style={{ color: C.stone }}>
              Gezielt kochen nach Diät, Allergenen, Organ-Nutzen und bioaktiven Vitamin-Kombinationen.
            </p>
          </div>

          <div className="flex gap-2.5 w-full md:w-auto">
            <button onClick={() => setScannerOpen(true)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
              style={{ background: C.coral }}>
              <span>📸</span> Kühlschrank-Scan
            </button>
            <Link to="/week-planner"
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 transition-all"
              style={{ background: C.forest }}>
              <span>📅</span> Wochenplaner
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Suche nach Rezeptname, Land (z. B. Japan, Mexiko), Vitaminen (B12, Omega-3) oder Organ (Herz, Darm)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white border text-sm font-medium shadow-xs focus:outline-none focus:ring-2"
            style={{ borderColor: C.border }}
          />
          <span className="absolute left-4 top-4 text-base text-gray-400">🔍</span>
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="absolute right-4 top-3.5 text-xs text-gray-400 hover:text-gray-600">
              Löschen ✕
            </button>
          )}
        </div>

        {/* Filters Matrix */}
        <div className="bg-white rounded-2xl p-4 border space-y-3 shadow-xs" style={{ borderColor: C.border }}>
          {/* Diets */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 w-16">Diät:</span>
            {DIETS.map(d => (
              <button key={d} onClick={() => { setDiet(d); setPage(1); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                style={{
                  background: diet === d ? C.forest : C.cream,
                  color: diet === d ? "#fff" : C.stone,
                }}>
                {d}
              </button>
            ))}
          </div>

          {/* Meal Types */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 w-16">Mahlzeit:</span>
            {MEAL_TYPES.map(m => (
              <button key={m} onClick={() => { setMealType(m); setPage(1); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                style={{
                  background: mealType === m ? C.mint : "transparent",
                  color: mealType === m ? "#fff" : C.stone,
                  border: mealType === m ? "none" : `1px solid ${C.border}`
                }}>
                {m}
              </button>
            ))}
          </div>

          {/* Vitamins & Organ Target */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex-shrink-0 w-16">Vitamine:</span>
            {VITAMINS.map(v => (
              <button key={v} onClick={() => { setVitamin(v); setPage(1); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full transition-all flex-shrink-0"
                style={{
                  background: vitamin === v ? "#0284c7" : "transparent",
                  color: vitamin === v ? "#fff" : C.stone,
                  border: vitamin === v ? "none" : `1px solid ${C.border}`
                }}>
                {v}
              </button>
            ))}
          </div>

          {/* Allergies & Countries */}
          <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Allergie-Ausschluss:</span>
              <select value={allergy} onChange={e => { setAllergy(e.target.value); setPage(1); }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border bg-white" style={{ borderColor: C.border }}>
                {ALLERGIES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Länderküche:</span>
              <select value={country} onChange={e => { setCountry(e.target.value); setPage(1); }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border bg-white" style={{ borderColor: C.border }}>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Zubereitungszeit:</span>
              <select value={time} onChange={e => { setTime(e.target.value); setPage(1); }}
                className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border bg-white" style={{ borderColor: C.border }}>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {(diet !== "Alle" || mealType !== "Alle" || allergy !== "Alle" || vitamin !== "Alle" || country !== "Alle" || time !== "Alle" || search) && (
              <button
                onClick={() => {
                  setDiet("Alle"); setMealType("Alle"); setAllergy("Alle"); setVitamin("Alle");
                  setCountry("Alle"); setTime("Alle"); setSearch(""); setPage(1);
                }}
                className="text-xs font-bold text-rose-600 hover:underline ml-auto">
                Filter zurücksetzen ✕
              </button>
            )}
          </div>
        </div>

        {/* Results Counter & Pagination header */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-medium text-gray-500">
            Zeige <strong className="text-gray-800">{paginated.length}</strong> von <strong className="text-gray-800">{filtered.length}</strong> Treffern (Seite {page} von {totalPages})
          </p>

          {totalPages > 1 && (
            <div className="flex gap-1.5 items-center">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 rounded bg-white border text-xs font-bold disabled:opacity-40 cursor-pointer">
                ← Zurück
              </button>
              <span className="text-xs font-bold px-2">{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="px-3 py-1 rounded bg-white border text-xs font-bold disabled:opacity-40 cursor-pointer">
                Weiter →
              </button>
            </div>
          )}
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border" style={{ borderColor: C.border }}>
            <p className="text-4xl mb-3">🔍</p>
            <h3 className="text-base font-bold text-gray-800 mb-1">Keine Rezepte für diese Filterkombination gefunden</h3>
            <p className="text-xs text-gray-500 mb-4">Versuche, Filter zurückzusetzen oder weniger spezifische Suchbegriffe zu nutzen.</p>
            <button onClick={() => { setDiet("Alle"); setMealType("Alle"); setAllergy("Alle"); setVitamin("Alle"); setCountry("Alle"); setTime("Alle"); setSearch(""); }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: C.forest }}>
              Alle Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map(r => <RecipeCard key={r.id} r={r} />)}
          </div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 pt-6 pb-4">
            <button disabled={page <= 1} onClick={() => { setPage(1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold disabled:opacity-40">
              « Erste
            </button>
            <button disabled={page <= 1} onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold disabled:opacity-40">
              ‹ Zurück
            </button>
            <span className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-700">
              Seite {page} von {totalPages}
            </span>
            <button disabled={page >= totalPages} onClick={() => { setPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold disabled:opacity-40">
              Weiter ›
            </button>
            <button disabled={page >= totalPages} onClick={() => { setPage(totalPages); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-3 py-1.5 rounded-lg bg-white border text-xs font-bold disabled:opacity-40">
              Letzte »
            </button>
          </div>
        )}

        {/* Medical disclaimer note */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed">
          <strong>⚠️ Wichtiger Gesundheitshinweis:</strong> Die Nährwertangaben, Vitamin-Kombinationen und organischen Wirkungsbeschreibungen dienen der allgemeinen Ernährungsbildung und Fitnessförderung. Sie ersetzen bei Vorerkrankungen, Stoffwechselstörungen oder Allergien keine individuelle medizinische Beratung durch einen approbierten Arzt oder zertifizierten Diätologen.
        </div>
      </div>
    </div>
  );
}
