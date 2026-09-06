import { useState } from "react";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

// â”€â”€ Slider with color gradient track â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ColorSlider({ value, onChange, min, max }: { value: number; onChange: (v: number) => void; min: number; max: number }) {
  const pct = ((value - min) / (max - min)) * 100;
  const color = pct < 40 ? C.mint : pct < 70 ? C.coral : "#D94F3D";
  return (
    <div className="relative">
      <div className="h-3 rounded-full relative overflow-hidden mb-1" style={{ background: `linear-gradient(to right, ${C.mint} 0%, ${C.coral} 60%, #D94F3D 100%)` }}>
        <div className="absolute top-0 right-0 bottom-0 rounded-full" style={{ width: `${100 - pct}%`, background: "rgba(255,255,255,0.5)" }} />
      </div>
      <input
        type="range" min={min} max={max} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
      />
      <div className="w-5 h-5 rounded-full border-2 border-white shadow-md absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none transition-colors"
        style={{ left: `${pct}%`, background: color, marginTop: -2 }} />
      <div className="flex justify-between text-[10px] mt-2" style={{ color: C.stone }}>
        <span>{min}</span>
        <span className="font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>{value} mg/dL</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// â”€â”€ BS Curve â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BsResultCurve({ startVal, impact, color }: { startVal: number; impact: number; color: string }) {
  const peakVal = startVal + impact;
  const rawPts = [startVal, startVal + impact * 0.35, peakVal, peakVal - impact * 0.06, startVal + impact * 0.6, startVal + impact * 0.32, startVal + 10, startVal + 2];
  const w = 400, h = 120, mn = Math.max(60, startVal - 30), mx = Math.max(220, peakVal + 30);
  const pts = rawPts.map((v, i) => ({
    x: (i / (rawPts.length - 1)) * w,
    y: h - ((v - mn) / (mx - mn)) * h,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `M${pts[0].x},${h} ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${pts[pts.length - 1].x},${h} Z`;
  const labelY = ((peakVal - mn) / (mx - mn));

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="bsrg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Normal zone */}
      <rect x={0} y={h - ((140 - mn) / (mx - mn)) * h} width={w} height={((70) / (mx - mn)) * h} fill={C.mint} fillOpacity="0.07" rx="2" />
      <text x={w - 4} y={h - ((140 - mn) / (mx - mn)) * h + 10} fontSize="9" fill={C.mint} opacity="0.8" textAnchor="end">140</text>
      <text x={w - 4} y={h - ((70 - mn) / (mx - mn)) * h - 2} fontSize="9" fill={C.mint} opacity="0.8" textAnchor="end">70</text>
      <path d={area} fill="url(#bsrg)" />
      <path d={line} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Peak dot + label */}
      {pts[2] && (
        <>
          <circle cx={pts[2].x} cy={pts[2].y} r="5" fill={color} />
          <text x={pts[2].x + 8} y={pts[2].y - 6} fontSize="10" fill={color} fontWeight="700" fontFamily="JetBrains Mono,monospace">{peakVal} mg/dL</text>
        </>
      )}
      {/* Start dot */}
      <circle cx={pts[0].x} cy={pts[0].y} r="4" fill={C.forest} />
    </svg>
  );
}

const MEAL_OPTIONS = [
  { label: "WÃ¤hle ein Rezeptâ€¦", impact: 0, carbs: 0, protein: 0, fat: 0 },
  ...RECIPES.map((r) => ({ label: r.title, impact: r.impact, carbs: r.carbs, protein: r.protein, fat: r.fat })),
];

export default function BloodSugar() {
  const [diary, setDiary] = useState([]);
  const [showDiaryToast, setShowDiaryToast] = useState(false);
  const [bsVal, setBsVal]     = useState(112);
  const [selMeal, setSelMeal] = useState(0);
  const [manualCarbs, setManualCarbs] = useState(60);
  const [manualProt, setManualProt]   = useState(25);
  const [manualFat, setManualFat]     = useState(15);
  const [afterSport, setAfterSport]   = useState(false);
  const [fasting, setFasting]         = useState(false);
  const [mode, setMode]               = useState<"recipe" | "manual">("recipe");
  const [calculated, setCalculated]   = useState(false);
  const [loading, setLoading]         = useState(false);
  const [activeSwap, setActiveSwap]   = useState<string | null>(null);

  const carbs   = mode === "recipe" ? MEAL_OPTIONS[selMeal].carbs : manualCarbs;
  const protein = mode === "recipe" ? MEAL_OPTIONS[selMeal].protein : manualProt;
  const fat     = mode === "recipe" ? MEAL_OPTIONS[selMeal].fat : manualFat;

  // Simple formula: each 10g carbs ~= 5 mg/dL rise, sport reduces by 20%, fasting adds 10%
  const baseImpact = mode === "recipe" && selMeal > 0
    ? MEAL_OPTIONS[selMeal].impact
    : Math.round((carbs * 0.5) + (protein * 0.1) - (fat * 0.1));
  const sport   = afterSport ? -Math.round(baseImpact * 0.2) : 0;
  const fastAdj = fasting ? Math.round(baseImpact * 0.1) : 0;
  const impact  = Math.max(5, baseImpact + sport + fastAdj);
  const swapReduction = activeSwap === "cauli" ? 0.70 : activeSwap === "lentils" ? 0.45 : activeSwap === "erythrit" ? 0.60 : activeSwap === "vinegar" ? 0.20 : 0;
  const effectiveImpact = activeSwap ? Math.max(5, Math.round(impact * (1 - swapReduction))) : impact;
  const peakVal = bsVal + effectiveImpact;
  const originalPeakVal = bsVal + impact;

  const color = peakVal < 140 ? C.mint : peakVal < 180 ? C.coral : "#D94F3D";
  const level = peakVal < 140 ? "Normal" : peakVal < 180 ? "ErhÃ¶ht" : "Hoch";

  const calculate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setCalculated(true); }, 900);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Blutzucker-Rechner ðŸ©¸
        </h1>
        <p className="text-sm mt-1" style={{ color: C.stone }}>
          Berechne den erwarteten Blutzucker-Anstieg fÃ¼r jede Mahlzeit â€“ personalisiert fÃ¼r deinen KÃ¶rper.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: inputs */}
        <div className="space-y-5">
          {/* Current BS */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Aktueller Blutzucker</h3>
            <div className="text-center mb-4">
              <span className="text-5xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: bsVal < 70 ? "#D94F3D" : bsVal < 140 ? C.mint : bsVal < 180 ? C.coral : "#D94F3D" }}>
                {bsVal}
              </span>
              <span className="text-base ml-1" style={{ color: C.stone }}>mg/dL</span>
            </div>
            <ColorSlider value={bsVal} onChange={setBsVal} min={50} max={300} />
          </div>

          {/* Meal selection */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Geplante Mahlzeit</h3>
            {/* Mode toggle */}
            <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: C.cream }}>
              {(["recipe", "manual"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{ background: mode === m ? C.white : "transparent", color: mode === m ? C.forest : C.stone }}>
                  {m === "recipe" ? "Rezept wÃ¤hlen" : "Manuell eingeben"}
                </button>
              ))}
            </div>

            {mode === "recipe" ? (
              <select
                value={selMeal}
                onChange={(e) => setSelMeal(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl text-sm border outline-none"
                style={{ borderColor: C.border, background: C.cream, color: C.ink }}
              >
                {MEAL_OPTIONS.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
              </select>
            ) : (
              <div className="space-y-3">
                {[
                  { label: "Kohlenhydrate (g)", val: manualCarbs, set: setManualCarbs },
                  { label: "Protein (g)", val: manualProt, set: setManualProt },
                  { label: "Fett (g)", val: manualFat, set: setManualFat },
                ].map((f) => (
                  <div key={f.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <label style={{ color: C.stone }}>{f.label}</label>
                      <span className="font-bold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{f.val}g</span>
                    </div>
                    <input type="range" min={0} max={200} value={f.val} onChange={(e) => f.set(Number(e.target.value))}
                      className="w-full" style={{ accentColor: C.mint }} />
                  </div>
                ))}
              </div>
            )}

            {/* Macros preview */}
            {(selMeal > 0 || mode === "manual") && (
              <div className="flex gap-3 mt-4 pt-3 border-t" style={{ borderColor: C.border }}>
                {[
                  { label: "KH", val: carbs, color: C.coral },
                  { label: "Protein", val: protein, color: C.mint },
                  { label: "Fett", val: fat, color: C.forest },
                ].map((m) => (
                  <div key={m.label} className="flex-1 text-center">
                    <div className="text-xs mb-0.5" style={{ color: C.stone }}>{m.label}</div>
                    <div className="text-lg font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: m.color }}>{m.val}g</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional factors */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>ZusÃ¤tzliche Faktoren</h3>
            <div className="space-y-3">
              {[
                { label: "Nach dem Sport essen", sub: "ErhÃ¶hte InsulinsensitivitÃ¤t â†’ weniger Anstieg", val: afterSport, set: setAfterSport },
                { label: "Auf nÃ¼chternen Magen", sub: "Leerer Magen â†’ schnellere Aufnahme", val: fasting, set: setFasting },
              ].map((t) => (
                <div key={t.label} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: C.cream }}>
                  <button
                    onClick={() => t.set(!t.val)}
                    className="w-10 h-5.5 rounded-full mt-0.5 transition-colors shrink-0 relative"
                    style={{ background: t.val ? C.mint : C.border, height: 22, width: 40 }}
                  >
                    <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
                      style={{ left: t.val ? "calc(100% - 18px)" : 2 }} />
                  </button>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.forest }}>{t.label}</p>
                    <p className="text-xs" style={{ color: C.stone }}>{t.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={calculate}
            disabled={loading}
            className="w-full py-4 rounded-xl text-base font-bold text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
            style={{ background: C.forest }}
          >
            {loading ? "â³ Berechneâ€¦" : "Jetzt berechnen â†’"}
          </button>
        </div>

        {/* Right: result */}
        <div>
          {!calculated ? (
            <div className="bg-white rounded-2xl border flex flex-col items-center justify-center text-center p-10 h-full" style={{ borderColor: C.border }}>
              <div className="text-6xl mb-4">ðŸ©º</div>
              <h3 className="text-lg font-bold mb-2" style={{ color: C.forest }}>Bereit zur Analyse</h3>
              <p className="text-sm" style={{ color: C.stone }}>
                Gib deinen aktuellen Blutzucker und eine Mahlzeit ein, dann berechnet FUDI deinen erwarteten Verlauf.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Big result */}
              <div className="bg-white rounded-2xl border p-6" style={{ borderColor: C.border }}>
                <p className="text-xs font-bold uppercase tracking-wide mb-3" style={{ color: C.stone }}>Ergebnis</p>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs mb-1" style={{ color: C.stone }}>Dein Blutzucker wird steigen auf:</p>
                    <div className="flex items-end gap-2">
                      <span className="text-5xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>
                        {peakVal}
                      </span>
                      <span className="text-base mb-1.5" style={{ color: C.stone }}>mg/dL</span>
                    </div>
                    <p className="text-sm font-semibold mt-1" style={{ color }}>â†‘ +{impact} mg/dL vom Startwert</p>
                  </div>
                  <span className="text-sm font-bold px-3 py-1.5 rounded-full text-white" style={{ background: color }}>{level}</span>
                </div>

                <BsResultCurve startVal={bsVal} impact={impact} color={color} />

                <div className="flex justify-between text-[10px] mt-1 mb-4" style={{ color: C.stone }}>
                  {["0h", "30min", "1h", "1.5h", "2h", "2.5h", "3h", "4h"].map((t) => <span key={t}>{t}</span>)}
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t" style={{ borderColor: C.border }}>
                  <div className="text-center">
                    <p className="text-[10px] mb-0.5" style={{ color: C.stone }}>Startwert</p>
                    <p className="text-sm font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{bsVal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] mb-0.5" style={{ color: C.stone }}>Peak</p>
                    <p className="text-sm font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>{peakVal}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] mb-0.5" style={{ color: C.stone }}>Normal nach</p>
                    <p className="text-sm font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>
                      {impact < 30 ? "2h" : impact < 50 ? "3h" : "4h+"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
                <h3 className="font-bold mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Empfehlungen</h3>
                <ul className="space-y-2.5">
                  {[
                    peakVal > 140 && "Warte 15 Minuten vor dem Essen fÃ¼r besseres Management",
                    peakVal > 140 && "Kombiniere mit 10g Ballaststoffen fÃ¼r langsameren Anstieg",
                    afterSport && "Dein Sport hat den Anstieg bereits um 20% reduziert â€“ gut gemacht!",
                    !afterSport && "Ein 10-minÃ¼tiger Spaziergang nach dem Essen reduziert den Anstieg um ~15%",
                    "Trinke 200ml Wasser vor der Mahlzeit fÃ¼r bessere MagensÃ¤urebalance",
                  ].filter(Boolean).map((tip, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: C.inkMid }}>
                      <span className="shrink-0 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white font-bold mt-0.5" style={{ background: C.mint }}>i</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Was-wÃ¤re-wenn Blutzucker-Optimierer */}
              <div className="bg-white rounded-2xl border p-5 shadow-sm" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">ðŸ’¡</span>
                    <h3 className="font-bold text-sm" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>
                      Was-wÃ¤re-wenn Zutaten-Optimierer
                    </h3>
                  </div>
                  {activeSwap && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white bg-green-600 animate-pulse">
                      ðŸ”» -{originalPeakVal - peakVal} mg/dL weniger Spitze!
                    </span>
                  )}
                </div>
                <p className="text-xs mb-3" style={{ color: C.stone }}>
                  Klicke auf eine Alternative, um die Auswirkung auf deine Glukosekurve live zu simulieren:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                  {[
                    { id: "cauli", title: "Blumenkohlreis statt Reis", save: "-70% Glukosespitze", icon: "🥦" },
                    { id: "lentils", title: "Linsennudeln statt Pasta", save: "-45% Anstieg, +14g Protein", icon: "🌱" },
                    { id: "erythrit", title: "Erythrit statt Zucker", save: "0 mg/dL Glukosepeak", icon: "✨" },
                    { id: "vinegar", title: "1 EL Apfelessig vorab", save: "-20% Glukosespitze", icon: "ðŸ" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setActiveSwap(activeSwap === s.id ? null : s.id)}
                      className={`text-left p-2.5 rounded-xl border text-xs transition-all ${
                        activeSwap === s.id
                          ? "bg-green-50 border-green-500 shadow-sm"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold" style={{ color: C.forest }}>
                        <span>{s.icon}</span>
                        <span>{s.title}</span>
                      </div>
                      <p className="text-[10px] mt-0.5 font-semibold text-green-700">{s.save}</p>
                    </button>
                  ))}
                </div>
                {activeSwap && (
                  <div className="p-2.5 rounded-xl bg-green-50 border border-green-200 text-[11px] text-green-800 flex items-center justify-between">
                    <span>âœ¨ Optimierter Blutzucker: <b>{peakVal} mg/dL</b> (statt {originalPeakVal} mg/dL)</span>
                    <button onClick={() => setActiveSwap(null)} className="underline text-green-900 font-bold ml-2">
                      ZurÃ¼cksetzen
                    </button>
                  </div>
                )}
              </div>

              {/* Diary Toast */}
{showDiaryToast && (
  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-xl flex items-center gap-2" style={{ background: C.forest }}>
    <span>✅</span> Eintrag gespeichert!
  </div>
)}
{/* Medical Disclaimer */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 flex items-start gap-2">
                <span className="text-base leading-none">âš•ï¸</span>
                <p>
                  <b>Medizinischer Hinweis:</b> Diese Simulation basiert auf standardisierten Modellberechnungen (GlykÃ¤mische Last & Resorptionskoeffizienten). Individuelle Stoffwechselreaktionen kÃ¶nnen variieren. FUDI stellt keine medizinische Diagnose oder Therapieempfehlung dar.
                </p>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
  className="py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95"
  style={{ background: C.forest }}
  onClick={() => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("de-DE"),
      time: new Date().toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      meal: selectedFood,
      startBs: bsVal,
      peakBs: peakVal,
      impact: effectiveImpact,
      swap: activeSwap,
    };
    const existing = JSON.parse(localStorage.getItem("fudi_bs_diary") || "[]");
    existing.unshift(entry);
    localStorage.setItem("fudi_bs_diary", JSON.stringify(existing.slice(0, 50)));
    setDiary(existing);
    setShowDiaryToast(true);
    setTimeout(() => setShowDiaryToast(false), 2500);
  }}
>
  In Tagebuch eintragen ✓
</button>
                <button
                  onClick={() => setCalculated(false)}
                  className="py-3 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: C.border, color: C.stone }}
                >
                  Neu berechnen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
