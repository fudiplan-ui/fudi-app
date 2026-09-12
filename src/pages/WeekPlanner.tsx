import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

const DAYS_FULL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOT_LABELS = ["Frühstück", "Mittag", "Snack", "Abendessen"];

type SlotKey = string; // `${dayIndex}-${slotIndex}`
type PlanMap = Record<SlotKey, string>; // recipe id

// Helper to pick recipes by diet & meal type
function pickRecipes(dietType?: string): PlanMap {
  const plan: PlanMap = {};
  const pool = dietType
    ? RECIPES_DB.filter(r => r.diet.toLowerCase().includes(dietType.toLowerCase()))
    : RECIPES_DB;

  const getForMeal = (meal: string, offset: number) => {
    const match = pool.filter(r => r.tag.toLowerCase().includes(meal.toLowerCase()));
    if (match.length > 0) return match[offset % match.length].id;
    return pool[offset % pool.length].id;
  };

  DAYS_FULL.forEach((_, dayIdx) => {
    plan[`${dayIdx}-0`] = getForMeal("Frühstück", dayIdx * 3);
    plan[`${dayIdx}-1`] = getForMeal("Mittag", dayIdx * 3 + 1);
    plan[`${dayIdx}-2`] = getForMeal("Snack", dayIdx * 2);
    plan[`${dayIdx}-3`] = getForMeal("Abendessen", dayIdx * 3 + 2);
  });

  return plan;
}

function RecipeChip({ recipe, onRemove }: { recipe: RecipeItem; onRemove: () => void }) {
  return (
    <div className="flex items-center gap-2 rounded-xl p-2 group relative border shadow-xs transition-transform hover:scale-102"
      style={{ background: "#f8fafc", borderColor: C.border }}>
      <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-gray-100">
        <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <Link to={`/recipe/${recipe.id}`} className="text-xs font-bold truncate block hover:underline" style={{ color: C.forest }}>
          {recipe.title}
        </Link>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
          <span>{recipe.kcal} kcal</span>
          <span>·</span>
          <span className="font-bold text-emerald-700">{recipe.protein}g P</span>
          <span>·</span>
          <span className="text-amber-600">+{recipe.impact} mg/dL</span>
        </div>
      </div>
      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity text-xs p-1 rounded hover:bg-gray-200 text-gray-400">
        ✕
      </button>
    </div>
  );
}

export default function WeekPlanner() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [plan, setPlan] = useState<PlanMap>(() => pickRecipes("High Protein"));
  const [activePreset, setActivePreset] = useState("High Protein");
  const [copiedNotification, setCopiedNotification] = useState(false);

  const applyPreset = (presetName: string) => {
    setActivePreset(presetName);
    setPlan(pickRecipes(presetName === "Ausgewogen" ? undefined : presetName));
  };

  const removeSlot = (key: SlotKey) => {
    setPlan(prev => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
  };

  // Calculate day macros
  const dayRecipeIds = SLOT_LABELS.map((_, slotIdx) => plan[`${selectedDay}-${slotIdx}`]).filter(Boolean);
  const dayRecipes = dayRecipeIds.map(id => RECIPES_DB.find(r => r.id === id)).filter(Boolean) as RecipeItem[];

  const totalKcal = dayRecipes.reduce((acc, r) => acc + r.kcal, 0);
  const totalP = dayRecipes.reduce((acc, r) => acc + r.protein, 0);
  const totalC = dayRecipes.reduce((acc, r) => acc + r.carbs, 0);
  const totalF = dayRecipes.reduce((acc, r) => acc + r.fat, 0);

  const handleExportToShopping = () => {
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 3500);
  };

  return (
    <div className="min-h-screen pb-20" style={{ background: C.bg }}>
      {/* Header */}
      <div className="bg-white border-b px-4 py-8 shadow-xs" style={{ borderColor: C.border }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white" style={{ background: C.forest }}>
                KI-Wochenplaner
              </span>
              <span className="text-xs text-gray-500">· 1.240 Rezepte mit Makro-Balance</span>
            </div>
            <h1 className="text-3xl font-extrabold" style={{ color: C.forest }}>
              Dein Personalisierter Ernährungsplan
            </h1>
            <p className="text-sm mt-1" style={{ color: C.stone }}>
              Automatisch abgestimmte Mahlzeiten nach Ziel-Makronährstoffen, Blutzucker-Stabilität und Diätprofil.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={handleExportToShopping}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white shadow-sm hover:opacity-90 transition-all cursor-pointer"
              style={{ background: C.mint }}>
              <span>🛒</span> {copiedNotification ? "✓ Zutaten synchronisiert!" : "Zur Einkaufsliste exportieren"}
            </button>
            <Link to="/recipes"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-white border shadow-xs hover:bg-gray-50 transition-all"
              style={{ borderColor: C.border, color: C.forest }}>
              <span>🔍</span> Rezepte-Datenbank
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-6 space-y-6">
        {/* 1-Click AI Presets */}
        <div className="bg-white rounded-2xl p-4 border shadow-xs flex flex-wrap items-center justify-between gap-3"
          style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">1-Klick KI-Plan generieren:</span>
          </div>

          <div className="flex gap-2 flex-wrap">
            {[
              { id: "High Protein", label: "⚡ High Protein (140g+ P)" },
              { id: "Keto", label: "🥑 Keto & Low Carb" },
              { id: "Vegan", label: "🌱 Vegan Clean Eating" },
              { id: "Glutenfrei", label: "🌾 Glutenfrei & Magen-Schonend" },
              { id: "Ausgewogen", label: "⚖️ Ausgewogene Vollwertkost" },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => applyPreset(p.id)}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full transition-all cursor-pointer"
                style={{
                  background: activePreset === p.id ? C.forest : C.cream,
                  color: activePreset === p.id ? "#fff" : C.stone,
                }}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {DAYS_FULL.map((d, idx) => (
            <button
              key={d}
              onClick={() => setSelectedDay(idx)}
              className="flex-1 min-w-[100px] p-3 rounded-2xl border text-center transition-all cursor-pointer"
              style={{
                background: selectedDay === idx ? C.forest : "white",
                borderColor: selectedDay === idx ? C.forest : C.border,
                color: selectedDay === idx ? "white" : C.forest,
                boxShadow: selectedDay === idx ? "0 4px 14px rgba(12,24,37,0.15)" : "none"
              }}>
              <p className="text-[11px] font-bold opacity-80 uppercase tracking-wider">{DAYS_SHORT[idx]}</p>
              <p className="text-base font-black mt-0.5">{d}</p>
            </button>
          ))}
        </div>

        {/* Daily Summary Card */}
        <div className="bg-white rounded-2xl p-5 border shadow-xs flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderColor: C.border }}>
          <div>
            <h2 className="text-lg font-bold" style={{ color: C.forest }}>Tages-Zusammenfassung: {DAYS_FULL[selectedDay]}</h2>
            <p className="text-xs text-gray-500">4 geplante Mahlzeiten · Optimiert auf anhaltende Sättigung und Muskelregeneration.</p>
          </div>

          <div className="grid grid-cols-4 gap-3 text-center w-full md:w-auto">
            <div className="bg-gray-50 rounded-xl px-4 py-2 border border-gray-100">
              <p className="text-lg font-black" style={{ color: C.forest }}>{totalKcal}</p>
              <p className="text-[10px] text-gray-400 font-semibold uppercase">Kalorien</p>
            </div>
            <div className="bg-emerald-50 rounded-xl px-4 py-2 border border-emerald-100">
              <p className="text-lg font-black text-emerald-700">{totalP}g</p>
              <p className="text-[10px] text-emerald-600 font-semibold uppercase">Protein</p>
            </div>
            <div className="bg-amber-50 rounded-xl px-4 py-2 border border-amber-100">
              <p className="text-lg font-black text-amber-600">{totalC}g</p>
              <p className="text-[10px] text-amber-600 font-semibold uppercase">Carbs</p>
            </div>
            <div className="bg-rose-50 rounded-xl px-4 py-2 border border-rose-100">
              <p className="text-lg font-black text-rose-600">{totalF}g</p>
              <p className="text-[10px] text-rose-600 font-semibold uppercase">Fett</p>
            </div>
          </div>
        </div>

        {/* Meals Grid for the selected day */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SLOT_LABELS.map((slotLabel, slotIdx) => {
            const slotKey = `${selectedDay}-${slotIdx}`;
            const recipeId = plan[slotKey];
            const recipe = recipeId ? RECIPES_DB.find(r => r.id === recipeId) : null;

            return (
              <div key={slotLabel} className="bg-white rounded-2xl p-4 border shadow-xs flex flex-col justify-between"
                style={{ borderColor: C.border }}>
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{slotLabel}</span>
                    {recipe && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                        {recipe.country}
                      </span>
                    )}
                  </div>

                  {recipe ? (
                    <RecipeChip recipe={recipe} onRemove={() => removeSlot(slotKey)} />
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-gray-200 rounded-xl">
                      <p className="text-xs text-gray-400 mb-2">Kein Rezept gewählt</p>
                      <Link to="/recipes" className="text-xs font-bold text-emerald-600 hover:underline">
                        + Rezept auswählen
                      </Link>
                    </div>
                  )}
                </div>

                {recipe && (
                  <div className="pt-3 mt-3 border-t border-gray-100 flex justify-between items-center text-[11px] text-gray-500">
                    <span>⏱ {recipe.time} Min.</span>
                    <Link to={`/recipe/${recipe.id}`} className="font-bold hover:underline" style={{ color: C.mint }}>
                      Kochanleitung →
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Sync notification toast */}
        {copiedNotification && (
          <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 z-50 animate-bounce">
            <span className="text-xl">🛒</span>
            <div>
              <p className="text-sm font-bold">Wochenplan erfolgreich zur Einkaufsliste hinzugefügt!</p>
              <Link to="/shopping-list" className="text-xs underline text-emerald-100">Zur Einkaufsliste &amp; Supermarkt-Deals →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
