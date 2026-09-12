import FridgeScannerModal from "../components/FridgeScannerModal";
import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

const MEAL_TYPES = ["Alle", "Frühstück", "Mittag", "Abendessen", "Snack"];
const DIETS = ["Alle", "High Protein", "Low Carb", "Keto", "Vegan", "Vegetarisch", "Glutenfrei"];
const TIMES = ["Alle", "< 15 min", "< 30 min", "< 60 min"];

function GIBadge({ gi }: { gi: string }) {
  const color = gi === "low" ? C.mint : C.coral;
  const label = gi === "low" ? "Low GI" : "Med GI";
  return (
    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs" style={{ background: color }}>
      {label}
    </span>
  );
}

function RecipeCard({ r }: { r: typeof RECIPES[0] }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="bg-white rounded-2xl overflow-hidden border transition-all hover:-translate-y-1 hover:shadow-lg relative flex flex-col justify-between"
      style={{ borderColor: C.border }}>
      <div>
        <div className="h-44 relative overflow-hidden" style={{ background: C.mintLight }}>
          <img src={r.img} alt={r.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
          <div className="absolute top-2 left-2"><GIBadge gi={r.gi} /></div>
          <div className="absolute top-2 right-2">
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white shadow-xs" style={{ background: "rgba(0,0,0,0.5)" }}>{r.tag}</span>
          </div>
          <button
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110 active:scale-95"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSaved((s) => !s); }}
            aria-label={saved ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
          >
            <span className="text-sm transition-all" style={{ color: saved ? "#e74c3c" : C.stone }}>
              {saved ? "❤️" : "🤍"}
            </span>
          </button>
        </div>

        <Link to={`/rezepte/${r.id}`} className="block p-3.5">
          <h3 className="font-bold text-sm leading-snug mb-2 hover:text-emerald-700 transition-colors" style={{ color: C.forest }}>
            {r.title}
          </h3>
          <div className="flex items-center gap-2 text-[11px] mb-2" style={{ color: C.stone }}>
            <span>⏱ {r.time} Min.</span>
            <span>👥 {r.portions} Port.</span>
            <span>⭐ {r.rating}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium" style={{ color: C.stone }}>
            <span>🔥 {r.kcal} kcal</span>
            <span className="font-bold text-emerald-700">🥩 {r.protein}g P</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>
              +{r.impact} mg/dL
            </span>
          </div>
        </Link>
      </div>

      <div className="px-3.5 pb-3 pt-0">
        <Link
          to={`/rezepte/${r.id}`}
          className="w-full py-1.5 rounded-xl text-center block text-[11px] font-bold border transition-colors hover:bg-emerald-50"
          style={{ borderColor: C.border, color: C.forest }}
        >
          🎙️ Mit Sprachassistent kochen →
        </Link>
      </div>
    </div>
  );
}

export default function RecipeSearch() {
  const [q, setQ]             = useState("");
  const [mealType, setMealType] = useState("Alle");
  const [diet, setDiet]       = useState("Alle");
  const [time, setTime]       = useState("Alle");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = RECIPES.filter((r) => {
    if (q && !r.title.toLowerCase().includes(q.toLowerCase())) return false;
    if (mealType !== "Alle" && r.tag !== mealType) return false;
    if (diet === "High Protein" && r.protein < 25) return false;
    if (diet === "Low Carb" && r.carbs > 35) return false;
    if (diet === "Vegan" && !["Buddha Bowl Deluxe", "Knuspriger Tofu-Erdnuss Wok", "Chia-Proteinpudding mit Nüssen"].includes(r.title)) return false;
    if (diet === "Vegetarisch" && ["Caesar Salat mit Hähnchen", "Gegrilltes Wildlachsfilet", "Mediterrane Meeresfrüchteplatte", "Rinderhüftsteak mit Brokkoli", "Thunfisch-Kichererbsen Salat"].includes(r.title)) return false;
    if (diet === "Glutenfrei" && ["Caesar Salat mit Hähnchen"].includes(r.title)) return false;

    if (time === "< 15 min" && r.time >= 15) return false;
    if (time === "< 30 min" && r.time >= 30) return false;
    if (time === "< 60 min" && r.time >= 60) return false;
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <FridgeScannerModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Rezepte & Ernährungs-Guide 🍲
          </h1>
          <p className="text-sm mt-1" style={{ color: C.stone }}>
            Blutzuckerschonend, nährstoffdicht & mit interaktivem Sprachassistenten
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 self-start sm:self-auto hover:opacity-90 active:scale-95"
          style={{ background: C.forest }}
        >
          <span>📸</span> Kühlschrank scannen & Reste verwerten
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border shadow-sm mb-6 space-y-4" style={{ borderColor: C.border }}>
        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Rezept suchen nach Zutat, Küche oder Gericht (z.B. Lachs, Tofu, Pancakes)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full text-xs p-3.5 pl-10 rounded-2xl border bg-gray-50 focus:outline-none focus:bg-white focus:ring-2 focus:ring-emerald-500"
            style={{ borderColor: C.border }}
          />
          <span className="absolute left-3.5 top-3.5 text-gray-400 text-sm">🔍</span>
        </div>

        {/* Diets filter */}
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Diät & Ernährungsform:</span>
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {DIETS.map((d) => (
              <button
                key={d}
                onClick={() => setDiet(d)}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 border"
                style={{
                  background: diet === d ? C.forest : "white",
                  color: diet === d ? "white" : C.stone,
                  borderColor: diet === d ? C.forest : C.border,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        {/* Meal type & Time */}
        <div className="flex flex-col sm:flex-row gap-4 pt-1 border-t border-gray-100">
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Mahlzeit:</span>
            <div className="flex gap-1.5 flex-wrap">
              {MEAL_TYPES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMealType(m)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all border"
                  style={{
                    background: mealType === m ? C.mint : "transparent",
                    color: mealType === m ? "white" : C.stone,
                    borderColor: mealType === m ? C.mint : C.border,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">Zubereitungszeit:</span>
            <div className="flex gap-1.5">
              {TIMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTime(t)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all border"
                  style={{
                    background: time === t ? C.coral : "transparent",
                    color: time === t ? "white" : C.stone,
                    borderColor: time === t ? C.coral : C.border,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Pro Chef Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-4 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2 rounded-2xl bg-white shadow-xs">👨‍🍳</span>
          <div>
            <h4 className="text-xs font-black text-amber-900">Geheimtipps der Sterneköche integriert</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Jedes Rezept enthält Tricks der Küchenchefs (Maillard-Reaktion, Säurebalance, Emulsions-Geheimnisse) für maximalen Geschmack bei minimalem Aufwand.
            </p>
          </div>
        </div>
        <span className="text-xs font-bold text-amber-700 shrink-0 hidden md:inline">In jedem Rezept verfügbar ★</span>
      </div>

      {/* Recipe Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {filtered.map((r) => (
          <RecipeCard key={r.id} r={r} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 bg-white rounded-3xl border" style={{ borderColor: C.border }}>
          <span className="text-4xl mb-2 block">🥗</span>
          <h3 className="font-bold text-base" style={{ color: C.forest }}>Kein Rezept für diese Filterkombination gefunden</h3>
          <p className="text-xs mt-1" style={{ color: C.stone }}>Versuche die Diät- oder Mahlzeitfilter zurückzusetzen.</p>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="p-4 bg-gray-50 rounded-2xl border text-[11px] text-gray-500 leading-relaxed" style={{ borderColor: C.border }}>
        <strong>⚠️ Wichtiger Gesundheitshinweis:</strong> Die in Fudi aufgeführten Diät-Profile, Organ-Wirkungen und Makronährstoffe basieren auf wissenschaftlich anerkannten Erkenntnissen der Sporternährung und Diätetik. Sie dienen ausschließlich allgemeinen Bildungs- und Informationszwecken und ersetzen bei Nahrungsmittelallergien, Zöliakie, chronisch-entzündlichen Darmerkrankungen oder Stoffwechselkrankheiten (z.B. Diabetes mellitus) keine individuelle medizinische Begleitung durch einen Facharzt oder zertifizierten Diätassistenten.
      </div>
    </div>
  );
}
