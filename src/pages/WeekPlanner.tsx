import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

const DAYS_FULL = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];
const DAYS_SHORT = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const SLOT_LABELS = ["FrÃ¼hstÃ¼ck", "Snack", "Mittag", "Snack", "Abendessen"];

type SlotKey = string; // `${dayIndex}-${slotIndex}`
type PlanMap = Record<SlotKey, number>; // recipe index

const INITIAL_PLAN: PlanMap = {
  "0-0": 3, "0-2": 0, "0-4": 5,
  "1-0": 4, "1-2": 2,
  "2-0": 7, "2-2": 11, "2-4": 9,
  "3-0": 3, "3-2": 0, "3-4": 5,
};

function RecipeChip({ recipeIdx, onRemove }: { recipeIdx: number; onRemove: () => void }) {
  const r = RECIPES[recipeIdx];
  if (!r) return null;
  return (
    <div className="flex items-center gap-1.5 rounded-lg p-1.5 group relative" style={{ background: C.mintLight }}>
      <div className="w-8 h-8 rounded-md overflow-hidden shrink-0" style={{ background: C.mint + "30" }}>
        <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold truncate leading-tight" style={{ color: C.forest }}>{r.title}</p>
        <p className="text-[9px]" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>+{r.impact} mg/dL</p>
      </div>
      <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] p-0.5 rounded" style={{ color: C.stone }}>âœ•</button>
    </div>
  );
}

function AddSlotMenu({ onSelect, onClose }: { onSelect: (i: number) => void; onClose: () => void }) {
  const [q, setQ] = useState("");
  const filtered = RECIPES.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="absolute z-20 top-full mt-1 left-0 right-0 bg-white rounded-xl border shadow-xl p-2" style={{ borderColor: C.border }}>
      <input
        value={q} onChange={(e) => setQ(e.target.value)}
        placeholder="Rezept suchenâ€¦"
        className="w-full text-xs px-2.5 py-1.5 rounded-lg border outline-none mb-2"
        style={{ borderColor: C.border, background: C.cream }}
        autoFocus
      />
      <div className="max-h-40 overflow-y-auto flex flex-col gap-0.5">
        {filtered.slice(0, 8).map((r, i) => (
          <button
            key={r.id}
            onClick={() => { onSelect(RECIPES.indexOf(r)); onClose(); }}
            className="flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-gray-50 text-xs"
            style={{ color: C.forest }}
          >
            <div className="w-6 h-6 rounded overflow-hidden shrink-0" style={{ background: C.mintLight }}>
              <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
            </div>
            <span className="flex-1 truncate font-medium">{r.title}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>+{r.impact}</span>
          </button>
        ))}
      </div>
      <button onClick={onClose} className="mt-2 w-full text-xs py-1 rounded-lg" style={{ color: C.stone }}>SchlieÃŸen</button>
    </div>
  );
}

function DayColumn({ dayIdx, plan, onAdd, onRemove }: {
  dayIdx: number;
  plan: PlanMap;
  onAdd: (day: number, slot: number, recipe: number) => void;
  onRemove: (key: string) => void;
}) {
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const todayIdx = (new Date().getDay() + 6) % 7;
  const isToday = dayIdx === todayIdx;

  const dayKcal = SLOT_LABELS.reduce((sum, _, si) => {
    const key = `${dayIdx}-${si}`;
    return plan[key] !== undefined ? sum + RECIPES[plan[key]].kcal : sum;
  }, 0);

  return (
    <div className="flex-1 min-w-[120px]">
      {/* Day header */}
      <div
        className="rounded-xl p-2 text-center mb-2"
        style={{ background: isToday ? C.forest : C.white, border: `1.5px solid ${isToday ? C.forest : C.border}` }}
      >
        <p className="text-[10px] font-semibold" style={{ color: isToday ? "rgba(255,255,255,0.6)" : C.stone }}>{DAYS_SHORT[dayIdx]}</p>
        <p className="text-xs font-black" style={{ color: isToday ? C.white : C.forest }}>{3 + dayIdx}</p>
        {dayKcal > 0 && <p className="text-[9px] mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace", color: isToday ? C.mint : C.stone }}>{dayKcal} kcal</p>}
      </div>

      {/* Slots */}
      <div className="space-y-1.5">
        {SLOT_LABELS.map((slotLabel, si) => {
          const key = `${dayIdx}-${si}`;
          const hasRecipe = plan[key] !== undefined;
          const isSnack = si === 1 || si === 3;
          if (isSnack && !hasRecipe) return (
            <div key={key} className="h-5 rounded flex items-center justify-center" style={{ background: "transparent" }}>
              <div className="w-4 h-px" style={{ background: C.border }} />
            </div>
          );
          return (
            <div key={key} className="relative">
              {hasRecipe ? (
                <RecipeChip recipeIdx={plan[key]} onRemove={() => onRemove(key)} />
              ) : (
                <button
                  onClick={() => setOpenSlot(openSlot === si ? null : si)}
                  className="w-full rounded-lg border-dashed border flex items-center justify-center text-[11px] transition-all hover:bg-gray-50"
                  style={{ borderColor: C.border, color: C.stone, height: 42 }}
                >
                  + {slotLabel.slice(0, 6)}
                </button>
              )}
              {openSlot === si && (
                <AddSlotMenu
                  onSelect={(rIdx) => onAdd(dayIdx, si, rIdx)}
                  onClose={() => setOpenSlot(null)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// â”€â”€ WeekGrid â€“ proper component so hooks are legal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function WeekCell({ slotKey, recipeIdx, isSnack, onAdd, onRemove }: {
  slotKey: string;
  recipeIdx: number | undefined;
  isSnack: boolean;
  onAdd: (rIdx: number) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(false);
  if (recipeIdx !== undefined) {
    return <RecipeChip recipeIdx={recipeIdx} onRemove={onRemove} />;
  }
  if (isSnack) return <div className="h-5 flex items-center justify-center"><div className="w-4 h-px" style={{ background: C.border }} /></div>;
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full rounded-lg border-dashed border flex items-center justify-center text-[10px] transition-all hover:bg-gray-50"
        style={{ borderColor: C.border, color: C.stone, height: 42 }}
      >
        +
      </button>
      {open && (
        <AddSlotMenu
          onSelect={(rIdx) => { onAdd(rIdx); setOpen(false); }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function WeekGrid({ plan, onAdd, onRemove, today }: {
  plan: PlanMap;
  onAdd: (day: number, slot: number, rIdx: number) => void;
  onRemove: (key: string) => void;
  today: number;
}) {
  return (
    <div className="bg-white rounded-2xl border p-4 overflow-x-auto" style={{ borderColor: C.border }}>
      <div className="flex gap-2 min-w-[700px]">
        <div className="w-16 shrink-0" />
        {DAYS_SHORT.map((d, i) => (
          <div key={d} className="flex-1 min-w-[120px] text-center text-[10px] font-bold uppercase tracking-wide mb-1"
            style={{ color: i === today ? C.forest : C.stone }}>{d}</div>
        ))}
      </div>
      {SLOT_LABELS.map((label, si) => (
        <div key={si} className="flex gap-2 mb-1.5 min-w-[700px]">
          <div className="w-16 shrink-0 flex items-center">
            <span className="text-[9px] font-semibold uppercase" style={{ color: C.stone }}>{label.slice(0, 8)}</span>
          </div>
          {DAYS_SHORT.map((_, di) => {
            const key = `${di}-${si}`;
            const isSnack = si === 1 || si === 3;
            return (
              <div key={di} className="flex-1 min-w-[120px]">
                <WeekCell
                  slotKey={key}
                  recipeIdx={plan[key]}
                  isSnack={isSnack}
                  onAdd={(rIdx) => onAdd(di, si, rIdx)}
                  onRemove={() => onRemove(key)}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}


// iCal Export helper
function generateIcal(plan, recipes) {
  const SLOT_TIMES = ["073000", "100000", "123000", "153000", "190000"];
  const SLOT_DUR   = ["PT30M", "PT15M", "PT60M", "PT15M", "PT45M"];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  let ical = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//FUDI//Wochenplan//DE\r\nCALSCALE:GREGORIAN\r\n";
  Object.entries(plan).forEach(([key, recipeIdx]) => {
    const [dayIdx, slotIdx] = key.split("-").map(Number);
    const recipe = recipes[recipeIdx];
    if (!recipe) return;
    const d = new Date(monday);
    d.setDate(monday.getDate() + dayIdx);
    const dateStr = d.toISOString().split("T")[0].replace(/-/g, "");
    const startTime = SLOT_TIMES[slotIdx] || "120000";
    ical += "BEGIN:VEVENT\r\nDTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z\r\nUID:fudi-" + key + "-" + Date.now() + "@fudi.app\r\nSUMMARY:Mahlzeit: " + recipe.title + "\r\nDESCRIPTION:" + recipe.kcal + " kcal / " + recipe.time + " min / BZ +" + recipe.impact + " mg/dL\r\nDTSTART:" + dateStr + "T" + startTime + "\r\nDURATION:" + (SLOT_DUR[slotIdx] || "PT30M") + "\r\nEND:VEVENT\r\n";
  });
  ical += "END:VCALENDAR";
  return ical;
}
export default function WeekPlanner() {
  const [plan, setPlan] = useState<PlanMap>(INITIAL_PLAN);
  const [view, setView] = useState<"week" | "day">("week");
  const today = (new Date().getDay() + 6) % 7; // 0=Mon â€¦ 6=Sun
  const [dayView, setDayView] = useState(today);

  const addRecipe = (day: number, slot: number, rIdx: number) => {
    setPlan((prev) => ({ ...prev, [`${day}-${slot}`]: rIdx }));
  };
  const removeRecipe = (key: string) => {
    setPlan((prev) => { const next = { ...prev }; delete next[key]; return next; });
  };

  const totalKcal = Object.values(plan).reduce((sum, rIdx) => sum + RECIPES[rIdx].kcal, 0);
  const mealsPlanned = Object.keys(plan).length;
  const totalSlots = 7 * 5;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Wochenplaner ðŸ“…
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.stone }}>
            KW 36 Â· 1.â€“7. September 2026 Â· {mealsPlanned}/{totalSlots} Mahlzeiten geplant
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
            style={{ borderColor: C.border, color: C.stone, background: C.white }}
            onClick={() => {
              // Auto-fill remaining slots
              const next = { ...plan };
              for (let d = 0; d < 7; d++) {
                [0, 2, 4].forEach((s) => {
                  const key = `${d}-${s}`;
                  if (!next[key]) next[key] = Math.floor(Math.random() * RECIPES.length);
                });
              }
              setPlan(next);
            }}
          >
            ðŸ¤– KI Auto-Planen
          </button>
          <Link
            to="/einkauf"
            className="px-3 py-2 rounded-xl text-xs font-semibold text-white"
            style={{ background: C.forest }}
          >
            ðŸ›’ Einkaufsliste erstellen
          </Link>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Geplante Mahlzeiten", val: mealsPlanned, unit: `/ ${totalSlots}`, color: C.mint },
          { label: "Ã˜ Kalorien / Tag", val: Math.round(totalKcal / 7), unit: "kcal", color: C.coral },
          { label: "Abgedeckte Tage", val: [...new Set(Object.keys(plan).map((k) => k.split("-")[0]))].length, unit: "/ 7 Tage", color: C.forest },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border p-3 text-center" style={{ borderColor: C.border }}>
            <p className="text-xs mb-1" style={{ color: C.stone }}>{s.label}</p>
            <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: s.color }}>{s.val}</p>
            <p className="text-[11px]" style={{ color: C.stone }}>{s.unit}</p>
          </div>
        ))}
      </div>

      {/* View toggle */}
      <div className="flex gap-1 p-1 rounded-xl mb-4 w-fit" style={{ background: C.cream }}>
        {(["week", "day"] as const).map((v) => (
          <button key={v} onClick={() => setView(v)}
            className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
            style={{ background: view === v ? C.white : "transparent", color: view === v ? C.forest : C.stone }}>
            {v === "week" ? "Woche" : "Tag"}
          </button>
        ))}
      </div>

      {/* Week view */}
      {view === "week" && (
        <WeekGrid plan={plan} onAdd={addRecipe} onRemove={removeRecipe} today={today} />
      )}

      {/* Day view */}
      {view === "day" && (
        <div>
          <div className="flex gap-1 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
            {DAYS_FULL.map((d, i) => (
              <button key={d} onClick={() => setDayView(i)}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: dayView === i ? C.forest : C.white, color: dayView === i ? C.white : C.stone, border: `1.5px solid ${dayView === i ? C.forest : C.border}` }}>
                {d.slice(0, 2)} {3 + i}.
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {SLOT_LABELS.map((label, si) => {
              const key = `${dayView}-${si}`;
              const hasRecipe = plan[key] !== undefined;
              const recipe = hasRecipe ? RECIPES[plan[key]] : null;
              return (
                <div key={si} className="bg-white rounded-2xl border p-4 flex items-center gap-4" style={{ borderColor: C.border }}>
                  <div className="w-16 shrink-0">
                    <p className="text-[10px] font-bold uppercase" style={{ color: C.stone }}>{label}</p>
                    <p className="text-xs" style={{ color: C.stone }}>
                      {["07:30", "10:00", "12:30", "15:30", "19:00"][si]}
                    </p>
                  </div>
                  {recipe ? (
                    <>
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: C.mintLight }}>
                        <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold" style={{ color: C.forest }}>{recipe.title}</p>
                        <p className="text-xs" style={{ color: C.stone }}>ðŸ”¥ {recipe.kcal} kcal Â· â± {recipe.time} min</p>
                        <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace", color: recipe.gi === "low" ? C.mint : C.coral }}>+{recipe.impact} mg/dL</p>
                      </div>
                      <button onClick={() => removeRecipe(key)} className="text-xs px-2.5 py-1.5 rounded-lg" style={{ background: C.cream, color: C.stone }}>Ã„ndern</button>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl border-dashed border-2 flex items-center justify-center text-xl" style={{ borderColor: C.border }}>+</div>
                      <Link to="/rezepte" className="text-sm font-semibold" style={{ color: C.mint }}>Rezept hinzufÃ¼gen</Link>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Day summary */}
          {(() => {
            const dayRecipes = SLOT_LABELS.map((_, si) => plan[`${dayView}-${si}`]).filter(i => i !== undefined).map(i => RECIPES[i]);
            const kcal = dayRecipes.reduce((s, r) => s + r.kcal, 0);
            const protein = dayRecipes.reduce((s, r) => s + r.protein, 0);
            const carbs = dayRecipes.reduce((s, r) => s + r.carbs, 0);
            if (dayRecipes.length === 0) return null;
            return (
              <div className="mt-4 rounded-2xl p-4" style={{ background: C.forest }}>
                <p className="text-xs font-bold text-white mb-3">Tageszusammenfassung</p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>{kcal}</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>kcal</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.coral }}>{protein}g</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>Protein</p>
                  </div>
                  <div>
                    <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: "rgba(255,255,255,0.8)" }}>{carbs}g</p>
                    <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.5)" }}>Kohlenhydrate</p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
