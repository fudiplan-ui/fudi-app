import FridgeScannerModal from "../components/FridgeScannerModal";
import { useState } from "react";
import { Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

// ── Mini donut chart ──────────────────────────────────────────────
function Donut({ slices, size = 72 }: { slices: { val: number; color: string }[]; size?: number }) {
  const r = size / 2 - 8, cx = size / 2, cy = size / 2;
  const total = slices.reduce((a, s) => a + s.val, 0);
  let offset = -90;
  const arcs = slices.map((s) => {
    const deg = (s.val / total) * 360;
    const rad1 = (offset * Math.PI) / 180;
    const rad2 = ((offset + deg) * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad1), y1 = cy + r * Math.sin(rad1);
    const x2 = cx + r * Math.cos(rad2), y2 = cy + r * Math.sin(rad2);
    const large = deg > 180 ? 1 : 0;
    offset += deg;
    return { d: `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`, color: s.color };
  });
  return (
    <svg width={size} height={size}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill={a.color} />)}
      <circle cx={cx} cy={cy} r={r * 0.58} fill="white" />
    </svg>
  );
}

// ── Circular progress ─────────────────────────────────────────────
function CircleProgress({ pct, color, size = 64, label }: { pct: number; color: string; size?: number; label: string }) {
  const r = size / 2 - 5, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.border} strokeWidth="4" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="4"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)} strokeLinecap="round" />
      </svg>
      <span className="text-[10px] font-semibold" style={{ color: C.stone }}>{label}</span>
    </div>
  );
}

// ── Small bar ─────────────────────────────────────────────────────
function Bar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
      <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: color }} />
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────
function StatCard({ icon, label, value, unit, sub, accent, children }: {
  icon: string; label: string; value: string; unit?: string;
  sub?: string; accent: string; children?: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 border" style={{ borderColor: C.border }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm" style={{ background: accent + "18" }}>{icon}</span>
          <span className="text-xs font-medium" style={{ color: C.stone }}>{label}</span>
        </div>
        {sub && <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: accent + "18", color: accent }}>{sub}</span>}
      </div>
      <div className="flex items-end gap-1 mb-3">
        <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{value}</span>
        {unit && <span className="text-xs mb-1" style={{ color: C.stone }}>{unit}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Blood sugar mini chart ────────────────────────────────────────
function BsChart() {
  const pts = [112, 118, 142, 158, 145, 130, 120, 115, 112];
  const w = 200, h = 50;
  const mn = 90, mx = 180;
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w);
  const ys = pts.map((v) => h - ((v - mn) / (mx - mn)) * h);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const area = `M${xs[0]},${h} ${xs.map((x, i) => `L${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ")} L${xs[xs.length - 1]},${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="w-full">
      <defs>
        <linearGradient id="bs-g" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={C.mint} stopOpacity="0.2" />
          <stop offset="100%" stopColor={C.mint} stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={0} y={h - ((140 - mn) / (mx - mn)) * h} width={w} height={((70) / (mx - mn)) * h} fill={C.mint} fillOpacity="0.06" />
      <path d={area} fill="url(#bs-g)" />
      <path d={path} fill="none" stroke={C.mint} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={xs[xs.length - 1]} cy={ys[ys.length - 1]} r="3.5" fill={C.mint} />
    </svg>
  );
}

// ── Weekly mini calendar ──────────────────────────────────────────
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const WEEK_DATA = [
  { meals: 3, kcal: 1820, bs: 118 },
  { meals: 4, kcal: 2100, bs: 125 },
  { meals: 3, kcal: 1950, bs: 112 },
  { meals: 5, kcal: 2240, bs: 108 },
  { meals: 2, kcal: 1600, bs: 130 },
  { meals: 3, kcal: 2050, bs: 119 },
  { meals: 0, kcal: 0,    bs: 0  },
];

// ── Meal timeline ─────────────────────────────────────────────────
// status: "done" = gegessen | "planned" = geplant, noch nicht gegessen | "empty" = nicht geplant
const MEALS = [
  { time: "07:30", label: "Frühstück",  recipe: "Haferbrei mit Beeren", kcal: 340, img: RECIPES[3].img, status: "done"    },
  { time: "10:00", label: "Snack",      recipe: "Nüsse & Obst",         kcal: 180, img: RECIPES[6].img, status: "done"    },
  { time: "12:30", label: "Mittag",     recipe: "Buddha Bowl",          kcal: 420, img: RECIPES[0].img, status: "done"    },
  { time: "15:30", label: "Snack",      recipe: "Quinoa Salat",         kcal: 210, img: RECIPES[11].img, status: "planned" },
  { time: "19:00", label: "Abendessen", recipe: "—",                    kcal: 0,   img: "",              status: "empty"   },
] as const;

// ── Dashboard page ────────────────────────────────────────────────
export default function Dashboard() {
  const [waterMl, setWaterMl] = useState<number>(() => {
    return Number(localStorage.getItem("fudi_water_ml") || 1500);
  });

  const addWater = (amount: number) => {
    setWaterMl((prev) => {
      const next = Math.min(3500, prev + amount);
      localStorage.setItem("fudi_water_ml", String(next));
      return next;
    });
  };
  const [scannerOpen, setScannerOpen] = useState(false);
  // 0 = Monday … 6 = Sunday, matching DAYS array
  const today = (new Date().getDay() + 6) % 7;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: C.stone }}>Donnerstag, 3. September 2026</p>
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Guten Morgen, Max! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="relative p-2 rounded-xl border" style={{ borderColor: C.border, background: C.white }}>
            🔔
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold text-white flex items-center justify-center" style={{ background: C.coral }}>3</span>
          </button>
          <Link to="/profil">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: C.mint }}>M</div>
          </Link>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard icon="🔥" label="Kalorien" value="940" unit="/ 2.240 kcal" sub="+8%" accent={C.coral}>
          <Bar pct={42} color={C.coral} />
          <p className="text-[10px] mt-1" style={{ color: C.stone }}>1.300 kcal noch verfügbar</p>
        </StatCard>

        <StatCard icon="🥩" label="Makros" value="" unit="" accent={C.mint}>
          <div className="flex items-center gap-3">
            <Donut size={56} slices={[
              { val: 42, color: C.mint },
              { val: 35, color: C.coral },
              { val: 23, color: C.forest },
            ]} />
            <div className="text-[10px] flex flex-col gap-0.5" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
              <span style={{ color: C.mint }}>P 42g</span>
              <span style={{ color: C.coral }}>KH 95g</span>
              <span style={{ color: C.forest }}>F 38g</span>
            </div>
          </div>
        </StatCard>

        <StatCard icon="🩸" label="Blutzucker" value="112" unit="mg/dL" sub="Normal" accent={C.mint}>
          <BsChart />
          <p className="text-[10px] mt-1" style={{ color: C.mint }}>↘ stabil sinkend</p>
        </StatCard>

        <div className="bg-white rounded-2xl p-4 border flex flex-col justify-between gap-2" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: C.stone }}>Tagesziele &amp; Wasser</p>
            <span className="text-[10px] font-bold font-mono text-emerald-700">{(waterMl / 1000).toFixed(1)} / 2.5 L</span>
          </div>
          <div className="flex justify-around items-center">
            <CircleProgress pct={42} color={C.coral} label="Kcal" />
            <CircleProgress pct={65} color={C.mint} label="Protein" />
            <CircleProgress pct={Math.min(100, Math.round((waterMl / 2500) * 100))} color={C.forest} label="Wasser" />
          </div>
          <div className="flex gap-1.5 pt-1 border-t" style={{ borderColor: C.border }}>
            <button
              onClick={() => addWater(250)}
              className="flex-1 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 transition-all active:scale-95"
            >
              + 250ml 🥛
            </button>
            <button
              onClick={() => addWater(500)}
              className="flex-1 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[10px] font-bold text-emerald-800 transition-all active:scale-95"
            >
              + 500ml 💧
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left: meal timeline */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Heutige Mahlzeiten</h2>
            <Link to="/rezepte" className="text-sm font-semibold" style={{ color: C.mint }}>+ Hinzufügen</Link>
          </div>

          <div className="space-y-3">
            {MEALS.map((m, idx) => {
              const isDone    = m.status === "done";
              const isPlanned = m.status === "planned";
              const isEmpty   = m.status === "empty";
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl flex items-center gap-3 p-3 transition-all hover:shadow-sm border"
                  style={{
                    borderColor: isDone ? C.border : isPlanned ? C.coral + "50" : C.border,
                    borderStyle: isEmpty ? "dashed" : "solid",
                    opacity: isEmpty ? 0.6 : 1,
                  }}
                >
                  {m.img ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: C.mintLight }}>
                      <img src={m.img} alt={m.recipe} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: C.cream, border: `2px dashed ${C.border}` }}>+</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: C.stone }}>{m.time}</span>
                      <span className="text-[10px] font-semibold px-1.5 rounded-full" style={{ background: C.mintLight, color: C.forest }}>{m.label}</span>
                      {isPlanned && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: C.coral + "18", color: C.coral }}>Geplant</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold truncate" style={{ color: isDone ? C.forest : isPlanned ? C.inkMid : C.stone }}>
                      {isEmpty ? "Noch nicht geplant" : m.recipe}
                    </p>
                    {m.kcal > 0 && (
                      <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.stone }}>{m.kcal} kcal</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {isDone ? (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: C.mint }}>✓</span>
                    ) : isPlanned ? (
                      <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2" style={{ borderColor: C.coral, color: C.coral }}>○</span>
                    ) : (
                      <Link to="/rezepte" className="text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors hover:opacity-80" style={{ background: C.mintLight, color: C.forest }}>Wählen</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended recipes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Empfehlungen für dich</h2>
              <Link to="/rezepte" className="text-sm" style={{ color: C.stone }}>Alle</Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
              {RECIPES.slice(0, 6).map((r) => (
                <Link
                  key={r.id}
                  to={`/rezepte/${r.id}`}
                  className="shrink-0 w-40 bg-white rounded-2xl border overflow-hidden hover:-translate-y-1 transition-transform block"
                  style={{ borderColor: C.border }}
                >
                  <div className="h-24 relative" style={{ background: C.mintLight }}>
                    <img src={r.img} alt={r.title} className="w-full h-full object-cover" />
                    <div
                      className="absolute top-1.5 left-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white"
                      style={{ background: r.gi === "low" ? C.mint : C.coral }}
                    >
                      {r.gi === "low" ? "Low GI" : "Med GI"}
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-[11px] font-bold leading-tight mb-1" style={{ color: C.forest }}>{r.title}</p>
                    <div className="flex justify-between text-[10px]" style={{ color: C.stone }}>
                      <span>⏱ {r.time}m</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace", color: r.gi === "low" ? C.mint : C.coral }}>+{r.impact}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Weekly overview */}
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>Diese Woche</h3>
            <div className="grid grid-cols-7 gap-1">
              {DAYS.map((d, i) => {
                const data = WEEK_DATA[i];
                const active = i === today;
                return (
                  <div
                    key={d}
                    className="flex flex-col items-center gap-1 p-1 rounded-xl cursor-pointer transition-all"
                    style={{ background: active ? C.forest : "transparent" }}
                  >
                    <span className="text-[9px] font-semibold" style={{ color: active ? "rgba(255,255,255,0.7)" : C.stone }}>{d}</span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: active ? C.mint : data.meals > 0 ? C.mintLight : C.border, color: active ? C.white : C.forest }}
                    >
                      {data.meals || "–"}
                    </div>
                    {data.bs > 0 && (
                      <span className="text-[8px]" style={{ fontFamily: "'JetBrains Mono',monospace", color: active ? "rgba(255,255,255,0.6)" : C.stone }}>{data.bs}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between text-xs" style={{ borderColor: C.border }}>
              <div><span style={{ color: C.stone }}>Ø Kcal</span><br /><b style={{ color: C.forest }}>1.920</b></div>
              <div className="text-center"><span style={{ color: C.stone }}>Ø Blutzucker</span><br /><b style={{ color: C.mint, fontFamily: "'JetBrains Mono',monospace" }}>118 mg/dL</b></div>
              <div className="text-right"><span style={{ color: C.stone }}>Mahlzeiten</span><br /><b style={{ color: C.forest }}>20 / 28</b></div>
            </div>
          </div>

          {/* AI insight */}
          <div className="rounded-2xl p-4" style={{ background: C.forest }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🤖</span>
              <span className="text-xs font-bold text-white">KI-Insight</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
              Dein Blutzucker ist <strong className="text-white">morgens 12% höher</strong> als abends. Versuche ein Low-GI Frühstück wie Haferbrei mit Nüssen.
            </p>
            <Link to="/stats" className="mt-3 block text-xs font-semibold" style={{ color: C.mint }}>Stats ansehen →</Link>
          </div>

          {/* Kühlschrank-Scan Banner */}
          <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">No-Waste Chef</span>
              <h4 className="font-bold text-base mt-0.5 mb-1">Kühlschrank scannen</h4>
              <p className="text-xs text-emerald-100 mb-3">
                Fotografiere deine Vorräte: FUDI findet passende Low-GI Rezepte und verhindert Food-Waste.
              </p>
              <button
                onClick={() => setScannerOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white text-emerald-900 font-bold text-xs shadow-md transition-all hover:bg-emerald-50 active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>📸 Scan starten</span>
                <span>➔</span>
              </button>
            </div>
          </div>

          <FridgeScannerModal isOpen={scannerOpen} onClose={() => setScannerOpen(false)} />

          {/* Quick links */}
          <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>Schnellzugriff</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: "🩸", label: "Blutzucker", to: "/blutzucker" },
                { icon: "📅", label: "Planer",     to: "/planer" },
                { icon: "🛒", label: "Einkaufen",  to: "/einkauf" },
                { icon: "📈", label: "Stats",      to: "/stats" },
              ].map((q) => (
                <Link
                  key={q.label}
                  to={q.to}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all hover:bg-gray-50"
                  style={{ borderColor: C.border }}
                >
                  <span className="text-xl">{q.icon}</span>
                  <span className="text-[11px] font-semibold" style={{ color: C.forest }}>{q.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
