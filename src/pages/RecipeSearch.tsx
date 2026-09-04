import FridgeScannerModal from "../components/FridgeScannerModal";
import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

const CATS  = ["Alle", "Frühstück", "Mittag", "Abendessen", "Snack"];
const TIMES = ["Alle", "< 15 min", "< 30 min", "< 60 min"];
// High GI removed – no recipes carry gi="high" in the catalogue
const GI    = ["Alle", "Low GI", "Med GI"];

function GIBadge({ gi }: { gi: string }) {
  const color = gi === "low" ? C.mint : C.coral;
  const label = gi === "low" ? "Low GI" : "Med GI";
  return (
    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: color }}>
      {label}
    </span>
  );
}

// ── Recipe card with saved state ──────────────────────────────────
function RecipeCard({ r }: { r: typeof RECIPES[0] }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg relative"
      style={{ borderColor: C.border }}>
      <div className="h-44 relative overflow-hidden" style={{ background: C.mintLight }}>
        <img src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
        <div className="absolute top-2 left-2"><GIBadge gi={r.gi} /></div>
        <div className="absolute top-2 right-2">
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "rgba(0,0,0,0.4)" }}>{r.tag}</span>
        </div>
        {/* Heart button – stopPropagation so card link doesn't fire */}
        <button
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved((s) => !s); }}
          aria-label={saved ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        >
          <span className="text-sm transition-all" style={{ color: saved ? "#e74c3c" : C.stone }}>
            {saved ? "❤️" : "♡"}
          </span>
        </button>
      </div>
      {/* Wrap only the info in the Link */}
      <Link to={`/rezepte/${r.id}`} className="block p-3">
        <h3 className="font-bold text-sm leading-snug mb-2" style={{ color: C.forest }}>{r.title}</h3>
        <div className="flex items-center gap-2 text-[11px] mb-2" style={{ color: C.stone }}>
          <span>⏱ {r.time}min</span>
          <span>👥 {r.portions} Port.</span>
          <span>⭐ {r.rating}</span>
        </div>
        <div className="flex gap-2 text-[11px]" style={{ color: C.stone }}>
          <span>🔥 {r.kcal} kcal</span>
          <span>🥩 {r.protein}g</span>
          <span style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>
            +{r.impact} mg/dL
          </span>
        </div>
      </Link>
    </div>
  );
}

export default function RecipeSearch() {
  const [query, setQuery]     = useState("");
  const [cat, setCat]         = useState("Alle");
  const [time, setTime]       = useState("Alle");
  const [giFilter, setGi]     = useState("Alle");
  const [showFilter, setShow] = useState(false);
  const [sort, setSort]       = useState("Beliebtheit");
  const [scannerOpen, setScannerOpen] = useState(false);

  const filtered = RECIPES.filter((r) => {
    const q = query.toLowerCase();
    if (q && !r.title.toLowerCase().includes(q)) return false;
    if (cat !== "Alle" && r.tag !== cat) return false;
    if (time === "< 15 min" && r.time >= 15) return false;
    if (time === "< 30 min" && r.time >= 30) return false;
    if (time === "< 60 min" && r.time >= 60) return false;
    if (giFilter === "Low GI" && r.gi !== "low") return false;
    if (giFilter === "Med GI" && r.gi !== "med") return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Kochzeit")     return a.time - b.time;
    if (sort === "Kalorien")     return a.kcal - b.kcal;
    if (sort === "Blutzucker ↑") return a.impact - b.impact;
    return b.rating - a.rating; // Beliebtheit default
  });

  const hasFilters = cat !== "Alle" || time !== "Alle" || giFilter !== "Alle" || query;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Rezepte entdecken
        </h1>
        <p className="text-sm mt-1" style={{ color: C.stone }}>
          {RECIPES.length} Rezepte – gefiltert nach deinen Vorlieben &amp; Blutzucker-Wirkung
        </p>
      </div>

      {/* Kühlschrank-Scan Feature Callout */}
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm" style={{ borderColor: C.border }}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm" style={{ background: C.mintLight }}>
            📸
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight" style={{ color: C.forest }}>
              Kühlschrank-Scan &amp; No-Waste Chef
            </h3>
            <p className="text-xs" style={{ color: C.stone }}>
              Scanne deine Vorräte per Foto: Die KI erkennt Zutaten und schlägt sofort Low-GI Rezepte vor.
            </p>
          </div>
        </div>
        <button
          onClick={() => setScannerOpen(true)}
          className="shrink-0 px-4 py-2.5 rounded-xl font-bold text-xs text-white shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5"
          style={{ background: C.forest }}
        >
          <span>Foto scannen</span>
          <span>➔</span>
        </button>
      </div>

      <FridgeScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

      {/* Search bar */}
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base pointer-events-none">🔍</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Suche nach Rezepten, Zutaten, Küchen..."
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm outline-none border transition-colors"
            style={{ borderColor: C.border, background: C.white, color: C.ink }}
          />
          {query && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm w-5 h-5 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ color: C.stone }}
              onClick={() => setQuery("")}
            >
              ✕
            </button>
          )}
        </div>
        <button
          onClick={() => setShow(!showFilter)}
          className="px-4 rounded-xl text-sm font-semibold border flex items-center gap-1.5 transition-all"
          style={{
            borderColor: showFilter ? C.forest : C.border,
            background: showFilter ? C.forest : C.white,
            color: showFilter ? C.white : C.stone,
          }}
        >
          ⚙ Filter {hasFilters && !showFilter && <span className="w-2 h-2 rounded-full" style={{ background: C.coral }} />}
        </button>
      </div>

      {/* Filter panel */}
      {showFilter && (
        <div className="bg-white rounded-2xl border p-4 mb-4 grid md:grid-cols-3 gap-4 animate-fade-in" style={{ borderColor: C.border }}>
          <div>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: C.stone }}>Kochzeit</p>
            <div className="flex flex-wrap gap-1.5">
              {TIMES.map((t) => (
                <button key={t} onClick={() => setTime(t)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={{ borderColor: time === t ? C.mint : C.border, background: time === t ? C.mintLight : C.white, color: time === t ? C.forest : C.stone }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: C.stone }}>Blutzucker-Impact</p>
            <div className="flex flex-wrap gap-1.5">
              {GI.map((g) => (
                <button key={g} onClick={() => setGi(g)}
                  className="px-2.5 py-1 rounded-full text-xs font-semibold border transition-all"
                  style={{ borderColor: giFilter === g ? C.mint : C.border, background: giFilter === g ? C.mintLight : C.white, color: giFilter === g ? C.forest : C.stone }}>
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold mb-2 uppercase tracking-wide" style={{ color: C.stone }}>Sortierung</p>
            <div className="flex flex-col gap-1">
              {["Beliebtheit", "Kochzeit", "Kalorien", "Blutzucker ↑"].map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-left border transition-all"
                  style={{ borderColor: sort === s ? C.forest : C.border, background: sort === s ? C.forest : C.white, color: sort === s ? C.white : C.stone }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="md:col-span-3 flex justify-end pt-2 border-t" style={{ borderColor: C.border }}>
            <button
              onClick={() => { setCat("Alle"); setTime("Alle"); setGi("Alle"); setQuery(""); }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors hover:bg-gray-100 border"
              style={{ borderColor: C.border, color: C.stone }}
            >
              Zurücksetzen
            </button>
          </div>
        </div>
      )}

      {/* Category tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setCat(c)}
            className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all"
            style={{ background: cat === c ? C.forest : C.white, color: cat === c ? C.white : C.stone, border: `1.5px solid ${cat === c ? C.forest : C.border}` }}>
            {c}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs mb-4" style={{ color: C.stone }}>
        {sorted.length} Rezept{sorted.length !== 1 ? "e" : ""} gefunden
        {sort !== "Beliebtheit" && <span> · Sortiert nach: <strong>{sort}</strong></span>}
      </p>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-3">🥺</div>
          <h3 className="text-lg font-bold mb-1" style={{ color: C.forest }}>Keine Rezepte gefunden</h3>
          <p className="text-sm mb-5" style={{ color: C.stone }}>Versuche andere Filter oder einen anderen Suchbegriff.</p>
          <button
            onClick={() => { setQuery(""); setCat("Alle"); setTime("Alle"); setGi("Alle"); }}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: C.forest }}
          >
            Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((r) => <RecipeCard key={r.id} r={r} />)}
        </div>
      )}
    </div>
  );
}
