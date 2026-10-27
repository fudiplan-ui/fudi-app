import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import {
  generateWeekPlan,
  formatPrice,
  UserPreferences,
  DayPlan,
  MealSlot,
  markRecipeCooked,
  loadCookingHistory,
  saveCookingHistory,
} from "../lib/weekPlanner";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";
import { RECIPE_POOL } from "../data/recipePool";
import { WEEKLY_TIPS, getTipsForWeek } from "../data/weeklyTips";
import { findSubstitutes, hasSubstitute, getSubstituteNames } from "../data/ingredientSubstitutes";
import { geocodeAddress, ShopLocation } from "../lib/location";
import { ShopMap } from "../components/ShopMap";

const ALL_RECIPES = [...RECIPES_DB, ...RECIPE_POOL];

const DAYS_FULL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOT_LABELS: MealSlot[] = ["frühstück", "mittag", "abend"];

const DEFAULT_PREFS: UserPreferences = {
  diet: "Mixed",
  allergies: [],
  budgetPerWeek: 80,
  priorities: ["guenstig", "schnell", "saison"],
  noWaste: true,
  householdSize: 2,
  maxRepetitionDays: 30,
  persistHistory: true,
};

export default function WeekPlanner() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFS);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [nearbyShops, setNearbyShops] = useState<ShopLocation[]>([]);
  const [tips, setTips] = useState<typeof WEEKLY_TIPS>([]);
  const [generating, setGenerating] = useState(false);
  const [showTips, setShowTips] = useState(true);
  const [activeDayIdx, setActiveDayIdx] = useState(0);
  const [substituteModal, setSubstituteModal] = useState<{ ingredient: string; dayIdx: number; slotIdx: number } | null>(null);
  const [userLocationInput, setUserLocationInput] = useState("");
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  useEffect(() => {
    setTips(getTipsForWeek(0));
  }, []);

  const generatePlan = useCallback(async () => {
    setGenerating(true);
    setTimeout(async () => {
      const newPlan = await generateWeekPlan(prefs, new Date().toISOString().split("T")[0]);
      setPlan(newPlan.days);
      setNearbyShops(newPlan.nearbyShops);
      setGenerating(false);
    }, 300);
  }, [prefs]);

  useEffect(() => {
    generatePlan();
  }, [generatePlan]);

  const handleTogglePref = (key: keyof UserPreferences, value: any) => {
    setPrefs((p) => ({ ...p, [key]: value }));
  };

  const handleAddAllergy = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.trim();
    if (!val) return;
    setPrefs((p) => ({ ...p, allergies: [...p.allergies, val] }));
    e.target.value = "";
  };

  const handleRemoveAllergy = (allergy: string) => {
    setPrefs((p) => ({ ...p, allergies: p.allergies.filter((a) => a !== allergy) }));
  };

  const markCooked = (recipeId: string) => {
    markRecipeCooked(recipeId);
    generatePlan();
  };

  const handleGeocode = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = userLocationInput.trim();
    if (!q) return;
    setIsGeocoding(true);
    setGeocodeError("");
    try {
      const results = await geocodeAddress(q);
      if (results.length === 0) {
        setGeocodeError("Keine Ergebnisse für diese PLZ/Stadt gefunden.");
        return;
      }
      const best = results[0];
      setPrefs((p) => ({
        ...p,
        userLocation: { lat: best.lat, lon: best.lon, label: best.display_name },
      }));
      setUserLocationInput(best.display_name);
    } catch {
      setGeocodeError("Fehler beim Abrufen der Standortdaten.");
    } finally {
      setIsGeocoding(false);
    }
  };

  const allRecipesMap = new Map(ALL_RECIPES.map((r) => [r.id, r]));

  const getRecipeForSlot = (recipeId: string): RecipeItem | undefined => {
    return allRecipesMap.get(recipeId);
  };

  const dayTotals = plan.map((day) => {
    const allRecipes = Object.values(day.meals).flat();
    return {
      kcal: allRecipes.reduce((s, r) => s + r.kcal, 0),
      protein: allRecipes.reduce((s, r) => s + r.protein, 0),
      carbs: allRecipes.reduce((s, r) => s + r.carbs, 0),
      fat: allRecipes.reduce((s, r) => s + r.fat, 0),
    };
  });

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.forest }}>
              Wochenplaner – Dein persönlicher Speiseplan
            </h1>
            <p className="text-sm text-slate-600">
              Max. 3 Rezepte pro Mahlzeit · Max. 1× pro Monat pro Rezept · Blutzucker-freundlich · No-Waste
            </p>
          </div>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-sm transition-all"
            style={{ background: C.forest, opacity: generating ? 0.6 : 1 }}
          >
            {generating ? "Berechne…" : "🔄 Neuen Plan generieren"}
          </button>
        </div>

        {/* PLZ / Standort-Eingabe */}
        <form onSubmit={handleGeocode} className="bg-white rounded-2xl p-5 border shadow-sm" style={{ borderColor: C.border }}>
          <div className="flex flex-col md:flex-row gap-3">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">📍 Dein Standort (PLZ oder Stadt)</label>
            <div className="flex-1">
              <input
                type="text"
                placeholder="z. B. 10115 Berlin oder München"
                value={userLocationInput}
                onChange={(e) => setUserLocationInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-emerald-600"
              />
            </div>
            <button
              type="submit"
              disabled={isGeocoding}
              className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-sm transition-all"
              style={{ background: C.forest, opacity: isGeocoding ? 0.6 : 1 }}
            >
              {isGeocoding ? "Suche…" : "Standort finden"}
            </button>
          </div>
          {geocodeError && (
            <p className="mt-2 text-xs text-red-600">{geocodeError}</p>
          )}
          {prefs.userLocation && (
            <p className="mt-2 text-xs text-emerald-700">
              ✓ {prefs.userLocation.label}
            </p>
          )}
        </form>

        {/* Weekly Tips */}
        {showTips && tips.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">💡 Diese Woche</span>
              <span className="text-xs text-slate-500">3 Tipps für Küche & Vorrat</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tips.map((tip) => (
                <div key={tip.id} className="bg-white/80 backdrop-blur p-3 rounded-xl border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white" style={{ background: tip.category === "aufbewahrung" ? C.coral : tip.category === "zubereitung" ? C.mint : C.forest }}>
                      {tip.category === "aufbewahrung" ? "🧊" : tip.category === "zubereitung" ? "🍳" : "👅"}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{tip.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{tip.content}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTips(false)} className="text-[10px] text-slate-400 hover:text-slate-600 underline underline-offset-4">
              Tipps ausblenden
            </button>
          </div>
        )}

        {/* Day Selector Tabs */}
        <div className="grid grid-cols-7 gap-1 bg-white p-1 rounded-2xl border shadow-xs" style={{ borderColor: C.border }}>
          {DAYS_FULL.map((dName, dIdx) => {
            const isCurrent = activeDayIdx === dIdx;
            return (
              <button key={dIdx} onClick={() => setActiveDayIdx(dIdx)} className={`py-2 px-1 rounded-xl text-center transition-all ${isCurrent ? "bg-emerald-800 text-white font-black shadow-sm" : "bg-transparent text-slate-500 hover:bg-gray-100 font-semibold text-xs"}`}>
                {DAYS_SHORT[dIdx]}
              </button>
            );
          })}
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-2">
          {plan.map((day, dIdx) => (
            <div key={dIdx} className="border border-gray-100 rounded-xl p-3 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500">{DAYS_SHORT[dIdx]}</span>
                <span className="text-[10px] font-bold text-slate-400">{day.meals.frühstück.length + day.meals.mittag.length + day.meals.abend.length} Gerichte</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {SLOT_LABELS.map((slot) => (
                  <div key={slot} className="flex items-center gap-1">
                    <span className="text-[9px]">{slot === "frühstück" ? "🌅" : slot === "mittag" ? "☀️" : "🌙"}</span>
                    <span className="text-[9px] text-slate-400">{day.meals[slot].length}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                {Object.entries(day.meals).map(([slot, recipes]) => (
                  <div key={slot} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate w-16">{slot}</span>
                    <div className="flex gap-1">
                      {recipes.map((r) => (
                        <span key={r.id} className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[9px]" title={r.title}>{r.title[0]}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: C.forest }}>
              Wochenplaner – Dein persönlicher Speiseplan
            </h1>
            <p className="text-sm text-slate-600">
              Max. 3 Rezepte pro Mahlzeit · Max. 1× pro Monat pro Rezept · Blutzucker-freundlich · No-Waste
            </p>
          </div>
          <button
            onClick={generatePlan}
            disabled={generating}
            className="px-5 py-2.5 rounded-xl text-white font-semibold shadow-sm transition-all"
            style={{ background: C.forest, opacity: generating ? 0.6 : 1 }}
          >
            {generating ? "Berechne…" : "🔄 Neuen Plan generieren"}
          </button>
        {/* Weekly Tips */}
        {showTips && tips.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/50 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">💡 Diese Woche</span>
              <span className="text-xs text-slate-500">3 Tipps für Küche & Vorrat</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tips.map((tip) => (
                <div key={tip.id} className="bg-white/80 backdrop-blur p-3 rounded-xl border border-white shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold text-white" style={{ background: tip.category === "aufbewahrung" ? C.coral : tip.category === "zubereitung" ? C.mint : C.forest }}>
                      {tip.category === "aufbewahrung" ? "🧊" : tip.category === "zubereitung" ? "🍳" : "👅"}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">{tip.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{tip.content}</p>
                </div>
              ))}
            </div>
            <button onClick={() => setShowTips(false)} className="text-[10px] text-slate-400 hover:text-slate-600 underline underline-offset-4">
              Tipps ausblenden
            </button>
          </div>
        )}
        {/* Week Overview */}
        <div className="grid grid-cols-7 gap-2">
          {plan.map((day, dIdx) => (
            <div key={dIdx} className="border border-gray-100 rounded-xl p-3 bg-white/60 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-500">{DAYS_SHORT[dIdx]}</span>
                <span className="text-[10px] font-bold text-slate-400">{day.meals.frühstück.length + day.meals.mittag.length + day.meals.abend.length} Gerichte</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {SLOT_LABELS.map((slot) => (
                  <div key={slot} className="flex items-center gap-1">
                    <span className="text-[9px]">{slot === "frühstück" ? "🌅" : slot === "mittag" ? "☀️" : "🌙"}</span>
                    <span className="text-[9px] text-slate-400">{day.meals[slot].length}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2 space-y-1">
                {Object.entries(day.meals).map(([slot, recipes]) => (
                  <div key={slot} className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate w-16">{slot}</span>
                    <div className="flex gap-1">
                      {recipes.map((r) => (
                        <span key={r.id} className="w-5 h-5 rounded bg-slate-200 flex items-center justify-center text-[9px]" title={r.title}>{r.title[0]}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Active Day Detail */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-6" style={{ borderColor: C.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-4" style={{ borderColor: C.border }}>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{DAYS_FULL[activeDayIdx]} ({dayTotals[activeDayIdx]?.kcal || 0} kcal)</h2>
              <p className="text-xs text-slate-500">{dayTotals[activeDayIdx]?.protein || 0}g P · {dayTotals[activeDayIdx]?.carbs || 0}g C · {dayTotals[activeDayIdx]?.fat || 0}g F</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SLOT_LABELS.map((slot) => {
              const recipes = plan[activeDayIdx]?.meals[slot] || [];
              return (
                <div key={slot} className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono">{slot}</span>
                    {recipes.length === 0 && <span className="text-[10px] text-slate-400">Leer</span>}
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {recipes.map((recipe) => {
                      const hasSub = hasSubstitute(recipe.title);
                      return (
                        <div key={recipe.id} className="flex items-center gap-3 p-3 rounded-xl border shadow-sm hover:shadow-md transition-all" style={{ borderColor: C.border, background: "#fafafa" }}>
                          <img src={recipe.img} alt={recipe.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <Link to={`/rezepte/${recipe.id}`} className="text-sm font-bold text-slate-900 hover:text-emerald-700 line-clamp-1">{recipe.title}</Link>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-1">
                              <span className="font-mono text-slate-700">{recipe.kcal} kcal</span>
                              <span>·</span>
                              <span className="text-emerald-700 font-bold">{recipe.protein}g P</span>
                              {recipe.impact > 15 && <span className="text-amber-600">Peak +{recipe.impact}</span>}
                            </div>
                            {hasSub && (
                              <button onClick={() => setSubstituteModal({ ingredient: recipe.title, dayIdx: activeDayIdx, slotIdx })} className="text-[10px] text-emerald-700 hover:text-emerald-900 underline mt-1 flex items-center gap-1"><span>🔄</span> Alternativen</button>
                            )}
                          </div>
                          <button onClick={() => markCooked(recipe.id)} className="w-6 h-6 rounded-full text-[10px] font-bold text-emerald-700 border-emerald-200 border flex items-center justify-center hover:bg-emerald-50 transition-colors">✓</button>
                        </div>
                      );
                    })}
                    {recipes.length === 0 && (
                      <div className="p-3 text-center text-[11px] text-slate-400 rounded-lg border border-dashed border-gray-200 bg-gray-50/50">Keine Gerichte für diese Mahlzeit</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Substitute Modal */}
        {substituteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base" style={{ color: C.forest }}>Zutaten-Alternativen</h3>
                <button onClick={() => setSubstituteModal(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-slate-600 mb-4">{substituteModal.ingredient}</p>
              <div className="space-y-3">
                {hasSubstitute(substituteModal.ingredient) ? (
                  getSubstituteNames(substituteModal.ingredient).map((alt) => (
                    <div key={alt} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-emerald-50">
                      <span className="text-sm text-slate-700">{alt}</span>
                      <button className="text-xs bg-emerald-700 text-white px-3 py-1 rounded hover:bg-emerald-800">Ersetzen</button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Keine gespeicherten Alternativen für diese Zutat.</p>
                )}
              </div>
            </div>
          </div>
        {prefs.userLocation && (
          <div className="mt-8">
            <ShopMap shops={nearbyShops} userLocation={prefs.userLocation} />
          </div>
        )}
      </div>
    </div>
  );
}
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
                  }
                      onClick={() => setModalSlot({ dayIdx: activeDay, slotIdx })}
                      className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer hover:bg-emerald-50/50 transition-colors"
                      style={{ borderColor: C.border }}
                    >
                      <p className="text-xs font-bold text-slate-600">+ Gericht aus Datenbank wählen</p>
                    </div>
                  })
                </div>
              );
            })}
          </div>
        </div>

        {/* Substitute Modal */}
        {substituteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border" style={{ borderColor: C.border }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base" style={{ color: C.forest }}>Zutaten-Alternativen</h3>
                <button onClick={() => setSubstituteModal(null)} className="text-slate-400 hover:text-slate-600 text-xl">✕</button>
              </div>
              <p className="text-sm text-slate-600 mb-4">{substituteModal.ingredient}</p>
              <div className="space-y-3">
                {hasSubstitute(substituteModal.ingredient) ? (
                  getSubstituteNames(substituteModal.ingredient).map((alt) => (
                    <div key={alt} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50 hover:bg-emerald-50">
                      <span className="text-sm text-slate-700">{alt}</span>
                      <button className="text-xs bg-emerald-700 text-white px-3 py-1 rounded hover:bg-emerald-800">Ersetzen</button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">Keine gespeicherten Alternativen für diese Zutat.</p>
                )}
              </div>

              </div>
              </div>

                <select



                >


                  ))}


        )}

      </div>
    </div>
  );
}
