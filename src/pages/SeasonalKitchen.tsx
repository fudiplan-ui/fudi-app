import { useMemo, useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import {
  foodsForMonth,
  MONTH_NAMES,
  SEASONAL_FOODS,
  type SeasonalFood,
} from "../data/seasonalFood";
import { RECIPES_DB } from "../data/recipesDatabase";

const DISCLAIMER = (
  <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-[11px] text-amber-900 leading-relaxed">
    <strong>⚠️ Hinweis:</strong> Die Nährstoffangaben beziehen sich auf NRV (Nutrient Reference
    Values, VO (EU) Nr. 1169/2011) pro 100 g essbaren Anteils und dienen der allgemeinen
    Ernährungsbildung. Es werden keine gesundheitlichen Wirkungen versprochen (Health-Claims-VO
    (EG) Nr. 1924/2006). Bei Erkrankungen (u. a. Diabetes, Nierenerkrankungen), Allergien oder
    Unverträglichkeiten bitte ärztlich oder diätetisch beraten lassen.
  </div>
);

const MONTH_ABBR = ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"];

function FoodCard({ food, month }: { food: SeasonalFood; month: number }) {
  const matched = useMemo(() => {
    const kws = food.recipeKeywords.map((k) => k.toLowerCase());
    return RECIPES_DB.filter((r) => kws.some((k) => r.title.toLowerCase().includes(k))).slice(0, 3);
  }, [food]);
  const inSeason = food.months.includes(month);

  return (
    <div className="bg-white rounded-2xl border p-5 flex flex-col gap-3" style={{ borderColor: C.border }}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-bold text-sm" style={{ color: C.forest }}>{food.name}</h3>
          <p className="text-[11px] mt-0.5" style={{ color: C.stone }}>🌍 {food.region}</p>
        </div>
        {inSeason && (
          <span className="text-[10px] font-black px-2 py-0.5 rounded-full text-white shrink-0" style={{ background: C.mint }}>
            JETZT
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-1">
        {MONTH_ABBR.map((mn, i) => (
          <span
            key={mn}
            className="text-[9px] font-bold px-1 py-0.5 rounded"
            style={
              food.months.includes(i + 1)
                ? { background: i + 1 === month ? C.mint : C.mintLight, color: i + 1 === month ? "#fff" : C.forest }
                : { background: C.cream, color: C.inkSoft }
            }
          >
            {mn}
          </span>
        ))}
      </div>

      <ul className="space-y-1">
        {food.nutrients.map((n) => (
          <li key={n} className="text-[11px] flex gap-1.5" style={{ color: C.inkMid }}>
            <span style={{ color: C.mint }}>•</span> {n}
          </li>
        ))}
      </ul>

      <p className="text-[11px] italic leading-relaxed" style={{ color: C.stone }}>🌾 {food.note}</p>

      {matched.length > 0 && (
        <div className="mt-auto pt-2 border-t" style={{ borderColor: C.border }}>
          <p className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: C.stone }}>
            Passende Rezepte
          </p>
          <div className="flex flex-col gap-1">
            {matched.map((r) => (
              <Link key={r.id} to={`/recipe/${r.id}`} className="text-[11px] font-semibold hover:underline truncate" style={{ color: C.forest }}>
                → {r.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function SeasonalKitchen() {
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const foods = foodsForMonth(month);

  const allMatchedCount = useMemo(() => {
    const kws = new Set<string>();
    foods.forEach((f) => f.recipeKeywords.forEach((k) => kws.add(k.toLowerCase())));
    return RECIPES_DB.filter((r) => {
      const t = r.title.toLowerCase();
      return Array.from(kws).some((k) => t.includes(k));
    }).length;
  }, [foods]);

  return (
    <div className="min-h-screen pb-16" style={{ background: C.bg }}>
      <div className="bg-white border-b px-4 py-8 shadow-xs" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white" style={{ background: C.mint }}>
            Saisonküche
          </span>
          <h1 className="text-3xl font-extrabold mt-2" style={{ color: C.forest }}>
            Saisonkalender: {MONTH_NAMES[month - 1]}
          </h1>
          <p className="text-sm mt-1 max-w-2xl" style={{ color: C.stone }}>
            Welche Lebensmittel werden gerade geerntet – und welche Vitamine liefern sie? Mit
            passenden Rezepten aus der Datenbank: <strong style={{ color: C.forest }}>{foods.length} Lebensmittel</strong> sind im {MONTH_NAMES[month - 1]} in Saison, {allMatchedCount} Rezepte passen thematisch.
          </p>

          <div className="flex gap-1.5 mt-4 overflow-x-auto pb-1">
            {MONTH_NAMES.map((m, i) => (
              <button
                key={m}
                onClick={() => setMonth(i + 1)}
                className="text-xs font-bold px-3 py-1.5 rounded-full transition-all shrink-0"
                style={
                  month === i + 1
                    ? { background: C.forest, color: "#fff" }
                    : { background: "transparent", color: C.stone, border: `1px solid ${C.border}` }
                }
              >
                {m.slice(0, 3)}
                {i + 1 === new Date().getMonth() + 1 && " •"}
              </button>
            ))}
          </div>
          <p className="text-[10px] mt-1.5" style={{ color: C.inkSoft }}>• = aktueller Monat</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {foods.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border" style={{ borderColor: C.border }}>
            <p className="text-3xl mb-2">🌱</p>
            <p className="text-sm font-semibold" style={{ color: C.stone }}>
              Für diesen Monat sind noch keine Einträge erfasst.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {foods.map((f) => <FoodCard key={f.name} food={f} month={month} />)}
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <h2 className="font-bold text-sm mb-3" style={{ color: C.forest }}>
            🗓 Alle Saison-Lebensmittel im Überblick ({SEASONAL_FOODS.length})
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {SEASONAL_FOODS.map((f) => (
              <button
                key={f.name}
                onClick={() => setMonth(f.months[0])}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all hover:opacity-80"
                style={{ background: C.mintLight, color: C.forest }}
                title={`Saison: ${f.months.map((m) => MONTH_NAMES[m - 1].slice(0, 3)).join(", ")} – klicken zum Anzeigen`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">{DISCLAIMER}</div>
      </div>
    </div>
  );
}
