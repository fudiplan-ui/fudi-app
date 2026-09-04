import { useState } from "react";
import { useParams, Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

// ── Scale a human-readable amount string by a factor ─────────────
// Handles "150g", "2 EL", "½ Stück", "1 Stück", "8 Stück", etc.
function scaleAmount(amount: string, scale: number): string {
  if (scale === 1) return amount;
  // Replace vulgar fractions before parsing
  const normalised = amount
    .replace("½", "0.5").replace("¼", "0.25").replace("¾", "0.75")
    .replace("⅓", "0.33").replace("⅔", "0.67");
  const match = normalised.match(/^([\d.]+)\s*(.*)/);
  if (!match) return amount; // non-numeric (e.g. "nach Geschmack") → unchanged
  const num  = parseFloat(match[1]);
  const unit = match[2].trim();
  const result = num * scale;
  // Show as integer when clean, otherwise one decimal place
  const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(1).replace(/\.0$/, "");
  return unit ? `${formatted} ${unit}` : formatted;
}

// ── Blood sugar curve ─────────────────────────────────────────────
function BsCurve({ impact, color }: { impact: number; color: string }) {
  const base = 112, peak = base + impact;
  const rawPts = [base, base + impact * 0.3, peak, peak - impact * 0.08, base + impact * 0.55, base + impact * 0.28, base + 8, base];
  const w = 320, h = 100, mn = 90, mx = Math.max(220, peak + 20);
  const pts = rawPts.map((v, i) => ({
    x: (i / (rawPts.length - 1)) * w,
    y: h - ((v - mn) / (mx - mn)) * h,
  }));
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `M${pts[0].x},${h} ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${pts[pts.length - 1].x},${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="rcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={0} y={h - ((140 - mn) / (mx - mn)) * h} width={w} height={((70) / (mx - mn)) * h} fill={C.mint} fillOpacity="0.07" />
      <path d={area} fill="url(#rcg)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts[2] && <circle cx={pts[2].x} cy={pts[2].y} r="4" fill={color} />}
    </svg>
  );
}

// ── Macro bar ─────────────────────────────────────────────────────
function MacroBar({ label, val, max, color }: { label: string; val: number; max: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span style={{ color: C.stone }}>{label}</span>
        <span className="font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{val}g</span>
      </div>
      <div className="h-1.5 rounded-full" style={{ background: C.border }}>
        <div className="h-full rounded-full" style={{ width: `${Math.min((val / max) * 100, 100)}%`, background: color }} />
      </div>
    </div>
  );
}

// ── Star rating ───────────────────────────────────────────────────
function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className="text-sm" style={{ color: s <= Math.round(rating) ? C.coral : C.border }}>★</span>
      ))}
      <span className="text-xs ml-1 font-semibold" style={{ color: C.stone }}>{rating}</span>
    </div>
  );
}

// ── Steps ─────────────────────────────────────────────────────────
const STEPS_DATA = [
  "Alle Zutaten abwiegen und vorbereiten. Gemüse waschen und in mundgerechte Stücke schneiden.",
  "Quinoa oder Reis nach Packungsanleitung kochen. Mit einer Prise Salz würzen.",
  "Das Dressing aus Tahini, Zitronensaft, Knoblauch und Olivenöl zubereiten und gut verrühren.",
  "Alle Zutaten dekorativ in einer tiefen Schüssel anrichten. Dressing darüber geben.",
  "Mit Sesam, frischen Kräutern und optional einem gekochten Ei garnieren und servieren.",
];

const INGREDIENTS = [
  { name: "Quinoa (gekocht)", amount: "150g" },
  { name: "Kichererbsen (gekocht)", amount: "80g" },
  { name: "Rote Paprika", amount: "1 Stück" },
  { name: "Gurke", amount: "½ Stück" },
  { name: "Kirschtomaten", amount: "8 Stück" },
  { name: "Rote Zwiebel", amount: "¼ Stück" },
  { name: "Avocado", amount: "½ Stück" },
  { name: "Tahini", amount: "2 EL" },
  { name: "Zitronensaft", amount: "2 EL" },
  { name: "Olivenöl", amount: "1 EL" },
];

const VITAMINS = [
  { label: "Vitamin C", pct: 78 }, { label: "Vitamin K", pct: 55 },
  { label: "Eisen", pct: 32 }, { label: "Magnesium", pct: 28 },
  { label: "Kalzium", pct: 15 }, { label: "Zink", pct: 22 },
];

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = RECIPES.find((r) => r.id === id) ?? RECIPES[0];
  const [tab, setTab]         = useState<"overview" | "nutrients" | "steps">("overview");
  const [portions, setPortions] = useState(recipe.portions);
  const [saved, setSaved]     = useState(false);
  const [checked, setChecked] = useState<boolean[]>(Array(INGREDIENTS.length).fill(false));

  const color = recipe.gi === "low" ? C.mint : C.coral;
  const scale  = portions / recipe.portions;

  const toggleIngredient = (i: number) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  return (
    <div>
      {/* Hero image */}
      <div className="relative w-full h-64 md:h-80 overflow-hidden" style={{ background: C.mintLight }}>
        <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(45,80,22,0.65) 0%, transparent 60%)" }} />
        <Link to="/rezepte" className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-sm font-bold" style={{ color: C.forest }}>←</Link>
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center text-lg"
        >
          {saved ? "❤️" : "♡"}
        </button>
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'DM Sans',sans-serif" }}>{recipe.title}</h1>
          <div className="flex flex-wrap gap-2">
            {[
              { icon: "⏱", val: `${recipe.time} min` },
              { icon: "👥", val: `${portions} Port.` },
              { icon: "🔥", val: `${Math.round(recipe.kcal * scale)} kcal` },
            ].map((s) => (
              <span key={s.val} className="text-xs font-semibold text-white bg-white/20 px-2 py-1 rounded-lg backdrop-blur-sm">{s.icon} {s.val}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Quick info */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Stars rating={recipe.rating} />
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: color }}>
            {recipe.gi === "low" ? "Low GI" : "Med GI"}
          </span>
          <span className="text-xs" style={{ color: C.stone }}>{recipe.tag}</span>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setPortions(Math.max(1, portions - 1))} className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold" style={{ borderColor: C.border, color: C.forest }}>−</button>
            <span className="text-sm font-bold w-12 text-center" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{portions} Port.</span>
            <button onClick={() => setPortions(portions + 1)} className="w-7 h-7 rounded-lg border flex items-center justify-center font-bold" style={{ borderColor: C.border, color: C.forest }}>+</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 p-1 rounded-xl" style={{ background: C.cream }}>
          {(["overview", "nutrients", "steps"] as const).map((t) => {
            const labels = { overview: "Übersicht", nutrients: "Nährwerte", steps: "Zubereitung" };
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{ background: tab === t ? C.white : "transparent", color: tab === t ? C.forest : C.stone, boxShadow: tab === t ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}
              >
                {labels[t]}
              </button>
            );
          })}
        </div>

        {/* Overview tab */}
        {tab === "overview" && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ingredients */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Zutaten</h3>
                <button
                  onClick={() => {
                    setAddedToast(true);
                    setTimeout(() => setAddedToast(false), 2500);
                  }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg transition-all active:scale-95"
                  style={{ background: addedToast ? C.mint : C.mintLight, color: addedToast ? C.white : C.forest }}
                >
                  {addedToast ? "✓ Zur Liste hinzugefügt!" : "+ Einkaufsliste"}
                  + Einkaufsliste
                </button>
              </div>
              <div className="space-y-2">
                {INGREDIENTS.map((ing, i) => (
                  <label key={i} className="flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all hover:bg-gray-50">
                    <input type="checkbox" checked={checked[i]} onChange={() => toggleIngredient(i)} className="rounded" style={{ accentColor: C.mint }} />
                    <span className="flex-1 text-sm" style={{ color: checked[i] ? C.stone : C.ink, textDecoration: checked[i] ? "line-through" : "none" }}>{ing.name}</span>
                    <span className="text-xs font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.stone }}>
                      {scaleAmount(ing.amount, scale)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Nutrition summary */}
            <div>
              <h3 className="font-bold mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Nährwertübersicht</h3>
              <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: C.border }}>
                <div className="text-center mb-4">
                  <span className="text-4xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>
                    {Math.round(recipe.kcal * scale)}
                  </span>
                  <span className="text-sm ml-1" style={{ color: C.stone }}>kcal</span>
                </div>
                <div className="space-y-3">
                  <MacroBar label="Protein" val={Math.round(recipe.protein * scale)} max={60} color={C.mint} />
                  <MacroBar label="Kohlenhydrate" val={Math.round(recipe.carbs * scale)} max={100} color={C.coral} />
                  <MacroBar label="Fett" val={Math.round(recipe.fat * scale)} max={50} color={C.forest} />
                </div>
              </div>
              {/* Supermarkt-Preisvergleich & No-Waste */}
              <div className="bg-white rounded-2xl border p-4 mb-4" style={{ borderColor: C.border }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-xs uppercase tracking-wider" style={{ color: C.forest }}>
                    🛒 Supermarkt-Preisvergleich
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-green-800 bg-green-100">
                    Günstigster: Aldi Süd
                  </span>
                </div>
                <div className="space-y-1.5 text-xs">
                  {[
                    { store: "Aldi Süd", price: "1,89 €", badge: "Bester Preis", highlight: true },
                    { store: "Lidl", price: "1,95 €", badge: "" },
                    { store: "Rewe", price: "2,45 €", badge: "" },
                    { store: "Edeka", price: "2,65 €", badge: "" },
                    { store: "Bio-Supermarkt", price: "3,35 €", badge: "100% Bio" },
                  ].map((s) => (
                    <div
                      key={s.store}
                      className={`flex items-center justify-between p-2 rounded-xl ${
                        s.highlight ? "bg-emerald-50/80 border border-emerald-200 font-bold" : "hover:bg-gray-50"
                      }`}
                    >
                      <span className="text-gray-800">{s.store}</span>
                      <div className="flex items-center gap-2">
                        {s.badge && <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">{s.badge}</span>}
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", color: s.highlight ? C.forest : C.stone }}>
                          {s.price} / Port.
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: C.border }}>
                  <span className="text-green-700 font-semibold">🌱 +20 EcoPoints gutgeschrieben</span>
                  <span className="text-gray-500 font-mono">Spare bis zu 1,46 €</span>
                </div>
              </div>

              {/* BS impact teaser */}
              <div className="rounded-2xl p-4" style={{ background: color + "14", border: `1.5px solid ${color}30` }}>
                <p className="text-xs font-bold mb-1" style={{ color: C.stone }}>Blutzucker-Anstieg (erwartet)</p>
                <p className="text-3xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>+{recipe.impact} <span className="text-base font-medium" style={{ color: C.stone }}>mg/dL</span></p>
                <button onClick={() => setTab("nutrients")} className="mt-2 text-xs font-semibold" style={{ color }}>Vollanalyse ansehen →</button>
              </div>
            </div>
          </div>
        )}

        {/* Nutrients tab */}
        {tab === "nutrients" && (
          <div className="space-y-5">
            {/* BS chart */}
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h3 className="font-bold mb-1" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Blutzucker-Analyse</h3>
              <p className="text-xs mb-4" style={{ color: C.stone }}>Erwarteter Verlauf nach der Mahlzeit (Startwert: 112 mg/dL)</p>
              <div className="flex items-start gap-6 mb-4">
                <div>
                  <p className="text-xs" style={{ color: C.stone }}>Anstieg</p>
                  <p className="text-4xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color }}>+{recipe.impact}</p>
                  <p className="text-xs" style={{ color: C.stone }}>mg/dL</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: C.stone }}>Peak nach</p>
                  <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>45 min</p>
                </div>
                <div>
                  <p className="text-xs" style={{ color: C.stone }}>Normal nach</p>
                  <p className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>
                    {recipe.impact < 30 ? "2h" : recipe.impact < 50 ? "2.5h" : "3.5h"}
                  </p>
                </div>
              </div>
              <BsCurve impact={recipe.impact} color={color} />
              <div className="flex justify-between text-[10px] mt-1" style={{ color: C.stone }}>
                {["0h", "30min", "1h", "1.5h", "2h", "2.5h", "3h", "4h"].map((t) => <span key={t}>{t}</span>)}
              </div>
              <div className="mt-4 p-3 rounded-xl text-sm" style={{ background: color + "10" }}>
                <p className="font-semibold mb-1" style={{ color }}>Empfehlungen</p>
                <ul className="space-y-1 text-xs" style={{ color: C.inkMid }}>
                  <li>• Kombiniere mit einem Glas Wasser vor der Mahlzeit</li>
                  <li>• {recipe.gi === "low" ? "Dieses Gericht ist gut für stabile Blutzuckerwerte geeignet." : "Kombiniere mit Ballaststoffen für einen langsameren Anstieg."}</li>
                </ul>
              </div>
            </div>

            {/* Detailed nutrients */}
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h3 className="font-bold mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Nährstoff-Detail</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                {[
                  { label: "Kalorien", val: `${Math.round(recipe.kcal * scale)} kcal` },
                  { label: "Protein", val: `${Math.round(recipe.protein * scale)}g` },
                  { label: "Kohlenhydrate", val: `${Math.round(recipe.carbs * scale)}g` },
                  { label: "davon Zucker", val: `${Math.round(recipe.carbs * 0.3 * scale)}g` },
                  { label: "Fett", val: `${Math.round(recipe.fat * scale)}g` },
                  { label: "Ballaststoffe", val: `${Math.round(recipe.carbs * 0.15 * scale)}g` },
                  { label: "Salz", val: "0.8g" },
                  { label: "GI (geschätzt)", val: recipe.gi === "low" ? "≈ 38" : "≈ 58" },
                ].map((n) => (
                  <div key={n.label} className="flex justify-between py-1 border-b text-sm" style={{ borderColor: C.border }}>
                    <span style={{ color: C.stone }}>{n.label}</span>
                    <span className="font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{n.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vitamins */}
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
              <h3 className="font-bold mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Vitamine &amp; Mineralien (% Tagesbedarf)</h3>
              <div className="space-y-2.5">
                {VITAMINS.map((v) => (
                  <div key={v.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span style={{ color: C.stone }}>{v.label}</span>
                      <span className="font-semibold" style={{ fontFamily: "'JetBrains Mono',monospace", color: v.pct >= 50 ? C.mint : C.stone }}>{v.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: C.border }}>
                      <div className="h-full rounded-full" style={{ width: `${v.pct}%`, background: v.pct >= 50 ? C.mint : C.coral }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Steps tab */}
        {tab === "steps" && (
          <div className="space-y-4">
            {STEPS_DATA.map((step, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white shrink-0 mt-0.5" style={{ background: C.forest }}>
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-sm leading-relaxed" style={{ color: C.inkMid }}>{step}</p>
                  {i === 1 && (
                    <button className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1" style={{ background: C.mintLight, color: C.forest }}>
                      ⏱ Timer starten (20 min)
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="rounded-2xl p-4 text-center" style={{ background: C.mintLight }}>
              <p className="text-base font-bold mb-1" style={{ color: C.forest }}>Guten Appetit! 🎉</p>
              <p className="text-xs" style={{ color: C.stone }}>Mahlzeit als gegessen markieren?</p>
              <Link to="/dashboard" className="mt-2 inline-block px-5 py-2 rounded-xl text-sm font-bold text-white" style={{ background: C.forest }}>
                Zum Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Similar recipes */}
        <div className="mt-8">
          <h3 className="font-bold mb-3" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Ähnliche Rezepte</h3>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
            {RECIPES.filter((r) => r.id !== recipe.id).slice(0, 4).map((r) => (
              <Link key={r.id} to={`/rezepte/${r.id}`} className="shrink-0 w-36 bg-white rounded-xl border overflow-hidden hover:-translate-y-0.5 transition-transform block" style={{ borderColor: C.border }}>
                <div className="h-20 overflow-hidden" style={{ background: C.mintLight }}>
                  <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-2">
                  <p className="text-[11px] font-semibold leading-tight" style={{ color: C.forest }}>{r.title}</p>
                  <p className="text-[10px] mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>+{r.impact} mg/dL</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
