import { useState, useEffect } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

const DAYS_FULL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOT_LABELS = ["Frühstück", "Mittag", "Snack", "Abendessen"];

type SlotKey = string; // `${dayIndex}-${slotIndex}`
type PlanMap = Record<SlotKey, string>; // recipe id

function getDefaultPlan(): PlanMap {
  const plan: PlanMap = {};
  DAYS_FULL.forEach((_, dayIdx) => {
    plan[`${dayIdx}-0`] = String((dayIdx * 4) % 1200 + 1);
    plan[`${dayIdx}-1`] = String((dayIdx * 4 + 1) % 1200 + 1);
    plan[`${dayIdx}-2`] = String((dayIdx * 4 + 2) % 1200 + 1);
    plan[`${dayIdx}-3`] = String((dayIdx * 4 + 3) % 1200 + 1);
  });
  return plan;
}

export default function WeekPlanner() {
  const [activeDay, setActiveDay] = useState(0);
  const [selectedDiet, setSelectedDiet] = useState("Alle");
  const [plan, setPlan] = useState<PlanMap>(() => {
    try {
      const saved = localStorage.getItem("fudi_week_plan");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return getDefaultPlan();
  });

  // Modal State for Swapping / Customizing Meals
  const [modalSlot, setModalSlot] = useState<{ dayIdx: number; slotIdx: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDiet, setFilterDiet] = useState("Alle");

  // Save to LocalStorage
  const updatePlan = (newPlan: PlanMap) => {
    setPlan(newPlan);
    try {
      localStorage.setItem("fudi_week_plan", JSON.stringify(newPlan));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectRecipeForSlot = (recipeId: string) => {
    if (!modalSlot) return;
    const key = `${modalSlot.dayIdx}-${modalSlot.slotIdx}`;
    const updated = { ...plan, [key]: recipeId };
    updatePlan(updated);
    setModalSlot(null);
  };

  const handleRemoveSlot = (dayIdx: number, slotIdx: number) => {
    const key = `${dayIdx}-${slotIdx}`;
    const updated = { ...plan };
    delete updated[key];
    updatePlan(updated);
  };

  // Regeneration of whole week
  const handleRegenerateWeek = (diet?: string) => {
    const pool = diet && diet !== "Alle"
      ? RECIPES_DB.filter(r => r.diet.toLowerCase().includes(diet.toLowerCase()))
      : RECIPES_DB;

    const newPlan: PlanMap = {};
    DAYS_FULL.forEach((_, d) => {
      [0, 1, 2, 3].forEach((s) => {
        const offset = (d * 7 + s * 13) % pool.length;
        newPlan[`${d}-${s}`] = pool[offset].id;
      });
    });
    updatePlan(newPlan);
  };

  // Calculate day totals
  const dayRecipes = [0, 1, 2, 3].map(slotIdx => {
    const id = plan[`${activeDay}-${slotIdx}`];
    return RECIPES_DB.find(r => r.id === id);
  }).filter(Boolean) as RecipeItem[];

  const dayKcal = dayRecipes.reduce((s, r) => s + r.kcal, 0);
  const dayP = dayRecipes.reduce((s, r) => s + r.protein, 0);
  const dayC = dayRecipes.reduce((s, r) => s + r.carbs, 0);
  const dayF = dayRecipes.reduce((s, r) => s + r.fat, 0);

  // Filtered pool for modal
  const modalCandidates = RECIPES_DB.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.tag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDiet = filterDiet === "Alle" || r.diet.toLowerCase() === filterDiet.toLowerCase();
    return matchesSearch && matchesDiet;
  }).slice(0, 30); // show top 30 matching

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
              <span>📅</span> Variabler & Personalisierter Ernährungsplan
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Mein FUDI Wochenplaner
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              Passe jedes Gericht nach Belieben an. Klicke auf ein Gericht oder den Wechsel-Button, um Mahlzeiten aus der Datenbank flexibel auszutauschen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleRegenerateWeek(selectedDiet)}
              className="px-4 py-2 rounded-xl text-xs font-bold border bg-white hover:bg-gray-50 flex items-center gap-1.5 shadow-xs"
              style={{ borderColor: C.border, color: C.stone }}
            >
              <span>⚡</span> KI-Neu generieren
            </button>
            <Link
              to="/einkauf"
              className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-xs hover:opacity-90 flex items-center gap-1.5 bg-emerald-800"
            >
              <span>🛒</span> In Einkaufsliste
            </Link>
          </div>
        </div>

        {/* Day Selector Tabs */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-3 bg-white p-2 rounded-2xl border shadow-xs" style={{ borderColor: C.border }}>
          {DAYS_FULL.map((dName, dIdx) => {
            const isCurrent = activeDay === dIdx;
            return (
              <button
                key={dIdx}
                onClick={() => setActiveDay(dIdx)}
                className={`py-2.5 px-1 rounded-xl text-center transition-all ${
                  isCurrent
                    ? "bg-emerald-800 text-white font-black shadow-sm"
                    : "bg-transparent text-slate-600 hover:bg-gray-100 font-semibold"
                }`}
              >
                <span className="block text-xs md:text-sm">{DAYS_SHORT[dIdx]}</span>
                <span className="hidden md:block text-[10px] opacity-80 mt-0.5">{dName}</span>
              </button>
            );
          })}
        </div>

        {/* Active Day Overview Card */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6" style={{ borderColor: C.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: C.border }}>
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Tagesplan für {DAYS_FULL[activeDay]}
              </h2>
              <p className="text-xs text-slate-500">
                4 Mahlzeiten optimal abgestimmt auf stabile Glukosekurven & Mikronährstoffe.
              </p>
            </div>

            {/* Daily Macros Bar */}
            <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border text-xs font-mono font-bold" style={{ borderColor: C.border }}>
              <span className="text-slate-800">{dayKcal} kcal</span>
              <span className="text-emerald-700">{dayP}g Protein</span>
              <span className="text-amber-600">{dayC}g Carbs</span>
              <span className="text-blue-600">{dayF}g Fett</span>
            </div>
          </div>

          {/* 4 Meal Slots */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SLOT_LABELS.map((slotLabel, slotIdx) => {
              const recipeId = plan[`${activeDay}-${slotIdx}`];
              const recipe = RECIPES_DB.find(r => r.id === recipeId);

              return (
                <div
                  key={slotIdx}
                  className="rounded-2xl border p-4 transition-all bg-gray-50/50 hover:bg-white hover:shadow-sm"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-800 text-white font-mono">
                      {slotLabel}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setModalSlot({ dayIdx: activeDay, slotIdx })}
                        className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
                      >
                        <span>🔄</span> Gericht wechseln
                      </button>
                      {recipe && (
                        <button
                          onClick={() => handleRemoveSlot(activeDay, slotIdx)}
                          className="text-xs text-gray-400 hover:text-red-600 p-1"
                          title="Entfernen"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {recipe ? (
                    <div className="flex items-center gap-3">
                      <img
                        src={recipe.img}
                        alt={recipe.title}
                        className="w-16 h-16 rounded-xl object-cover border border-gray-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          to={`/rezepte/${recipe.id}`}
                          className="text-sm font-bold text-slate-900 hover:underline line-clamp-1 block"
                        >
                          {recipe.title}
                        </Link>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                          <span className="font-mono font-bold text-slate-800">{recipe.kcal} kcal</span>
                          <span>·</span>
                          <span className="font-mono text-emerald-700 font-bold">{recipe.protein}g P</span>
                          <span>·</span>
                          <span className="text-amber-600">Peak +{recipe.impact}</span>
                        </div>
                        <p className="text-[11px] text-emerald-800 mt-1 truncate">
                          ✨ {recipe.organBenefit?.organ || recipe.organ}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => setModalSlot({ dayIdx: activeDay, slotIdx })}
                      className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50/50 transition-colors"
                      style={{ borderColor: C.border }}
                    >
                      <p className="text-xs font-bold text-slate-600">+ Gericht aus Datenbank wählen</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Swap / Change Recipe Modal */}
        {modalSlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border" style={{ borderColor: C.border }}>
              {/* Modal Header */}
              <div className="p-5 border-b flex items-center justify-between bg-emerald-900 text-white">
                <div>
                  <h3 className="font-bold text-base">
                    Gericht wechseln: {DAYS_FULL[modalSlot.dayIdx]} · {SLOT_LABELS[modalSlot.slotIdx]}
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Wähle aus 1.240 Rezepten mit optimierter Blutzucker- & Mikronährstoffdichte.
                  </p>
                </div>
                <button
                  onClick={() => setModalSlot(null)}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Filters in Modal */}
              <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="🔍 Rezept, Zutat oder Land suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border text-xs focus:outline-emerald-600 bg-white"
                />
                <select
                  value={filterDiet}
                  onChange={(e) => setFilterDiet(e.target.value)}
                  className="px-3 py-2 rounded-xl border text-xs bg-white text-slate-700 font-semibold"
                >
                  {["Alle", "High Protein", "Low Carb", "Keto", "Vegan", "Vegetarisch", "Glutenfrei", "Paleo"].map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Recipe Candidates List */}
              <div className="p-4 overflow-y-auto divide-y space-y-2 flex-1">
                {modalCandidates.length === 0 ? (
                  <p className="text-center py-8 text-xs text-gray-500">Keine Rezepte für diesen Filter gefunden.</p>
                ) : (
                  modalCandidates.map((cand) => (
                    <div
                      key={cand.id}
                      onClick={() => handleSelectRecipeForSlot(cand.id)}
                      className="pt-2 pb-2 flex items-center justify-between gap-3 cursor-pointer hover:bg-emerald-50/60 p-2 rounded-xl transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img src={cand.img} alt={cand.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{cand.title}</p>
                          <p className="text-[10px] text-slate-500">
                            {cand.tag} · {cand.country} · {cand.diet}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right text-[11px] font-mono">
                          <span className="font-bold text-slate-800">{cand.kcal} kcal</span>
                          <span className="text-emerald-700 block font-semibold">+{cand.protein}g P</span>
                        </div>
                        <button className="text-xs px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-white font-bold">
                          Wählen
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
