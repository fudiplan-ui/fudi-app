import { useState } from "react";
import { C } from "../shared/colors";

// ── SVG line chart ────────────────────────────────────────────────
function LineChart({ datasets, w = 500, h = 140, xLabels }: {
  datasets: { data: number[]; color: string; label: string }[];
  w?: number; h?: number;
  xLabels: string[];
}) {
  const [hover, setHover] = useState<{ x: number; values: number[] } | null>(null);
  const pad = { t: 10, r: 10, b: 24, l: 36 };
  const cw = w - pad.l - pad.r;
  const ch = h - pad.t - pad.b;
  const allVals = datasets.flatMap((d) => d.data);
  const mn = Math.min(...allVals) * 0.9;
  const mx = Math.max(...allVals) * 1.05;
  const n  = datasets[0].data.length;
  const xOf = (i: number) => pad.l + (i / (n - 1)) * cw;
  const yOf = (v: number) => pad.t + ch - ((v - mn) / (mx - mn)) * ch;

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h}`} onMouseLeave={() => setHover(null)}>
      {/* Grid */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => {
        const y = pad.t + ch * f;
        const val = mx - (mx - mn) * f;
        return (
          <g key={f}>
            <line x1={pad.l} y1={y} x2={w - pad.r} y2={y} stroke={C.border} strokeWidth="0.5" />
            <text x={pad.l - 4} y={y + 3.5} fontSize="8" fill={C.stone} textAnchor="end">{Math.round(val)}</text>
          </g>
        );
      })}
      {/* X labels */}
      {xLabels.map((l, i) => (
        <text key={i} x={xOf(i)} y={h - 4} fontSize="8" fill={C.stone} textAnchor="middle">{l}</text>
      ))}
      {/* Lines */}
      {datasets.map((ds) => {
        const pts = ds.data.map((v, i) => ({ x: xOf(i), y: yOf(v) }));
        const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        const area = `M${pts[0].x},${pad.t + ch} ${pts.map((p) => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")} L${pts[pts.length - 1].x},${pad.t + ch} Z`;
        return (
          <g key={ds.label}>
            <defs>
              <linearGradient id={`lg-${ds.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ds.color} stopOpacity="0.15" />
                <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill={`url(#lg-${ds.label})`} />
            <path d={line} fill="none" stroke={ds.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        );
      })}
      {/* Hover */}
      {hover && (
        <line x1={hover.x} y1={pad.t} x2={hover.x} y2={pad.t + ch} stroke={C.stone} strokeWidth="1" strokeDasharray="3 2" />
      )}
      {/* Invisible hover zones */}
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} x={xOf(i) - cw / n / 2} y={pad.t} width={cw / n} height={ch}
          fill="transparent"
          onMouseEnter={() => setHover({ x: xOf(i), values: datasets.map((d) => d.data[i]) })}
        />
      ))}
    </svg>
  );
}

// ── Bar chart ─────────────────────────────────────────────────────
function BarChart({ data, labels, color }: { data: number[]; labels: string[]; color: string }) {
  const mx = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-24">
      {data.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full rounded-t-sm transition-all" style={{ height: `${(v / mx) * 80}px`, background: color, opacity: 0.8 + (i / data.length) * 0.2 }} />
          <span className="text-[8px]" style={{ color: C.stone }}>{labels[i]}</span>
        </div>
      ))}
    </div>
  );
}

// ── KPI card ──────────────────────────────────────────────────────
function KpiCard({ icon, label, value, unit, change, changePositive }: {
  icon: string; label: string; value: string; unit?: string;
  change?: string; changePositive?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl border p-4" style={{ borderColor: C.border }}>
      <div className="flex items-center gap-2 mb-2">
        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: C.mintLight }}>{icon}</span>
        <span className="text-xs" style={{ color: C.stone }}>{label}</span>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>{value}</span>
        {unit && <span className="text-xs mb-1" style={{ color: C.stone }}>{unit}</span>}
      </div>
      {change && (
        <p className="text-xs mt-1 font-semibold" style={{ color: changePositive ? C.mint : C.coral }}>
          {changePositive ? "↑" : "↓"} {change} vs. Vorwoche
        </p>
      )}
    </div>
  );
}

// ── Insight ───────────────────────────────────────────────────────
function Insight({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex gap-2.5 items-start p-3 rounded-xl" style={{ background: C.cream }}>
      <span className="text-xl shrink-0">{icon}</span>
      <p className="text-sm leading-relaxed" style={{ color: C.inkMid }}>{text}</p>
    </div>
  );
}

const PERIODS = ["Heute", "Woche", "Monat", "Jahr"];
const WEEK_LABELS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTH_LABELS = Array.from({ length: 30 }, (_, i) => i % 5 === 0 ? `${i + 1}` : "");

const BS_MORNING  = [108, 112, 118, 105, 115, 122, 109];
const BS_MIDDAY   = [130, 145, 128, 138, 142, 135, 127];
const BS_EVENING  = [118, 122, 115, 120, 128, 119, 114];
const KCAL_DATA   = [1820, 2100, 1950, 2240, 1600, 2050, 1780];
const WEIGHT_DATA = [73.2, 73.0, 72.8, 72.8, 72.5, 72.4, 72.3];
const MACRO_PROT  = [85, 92, 78, 98, 72, 88, 81];
const MACRO_CARBS = [210, 240, 195, 265, 185, 230, 210];
const MACRO_FAT   = [58, 65, 52, 70, 48, 62, 55];

export default function Stats() {
  const [period, setPeriod] = useState("Woche");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
            Stats &amp; Analytics 📈
          </h1>
          <p className="text-sm mt-0.5" style={{ color: C.stone }}>Deine Gesundheitsdaten im Überblick</p>
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ background: C.cream }}>
          {PERIODS.map((p) => (
            <button key={p} onClick={() => setPeriod(p)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{ background: period === p ? C.white : "transparent", color: period === p ? C.forest : C.stone }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard icon="🩸" label="Ø Blutzucker" value="118" unit="mg/dL" change="4%" changePositive={false} />
        <KpiCard icon="🔥" label="Ø Kalorien/Tag" value="1.934" unit="kcal" change="2%" changePositive={true} />
        <KpiCard icon="⚖️" label="Gewicht" value="72.3" unit="kg" change="0.9 kg" changePositive={true} />
        <KpiCard icon="🧪" label="HbA1c" value="5.8" unit="%" change="0.1%" changePositive={true} />
      </div>

      {/* Charts grid */}
      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Blutzucker Verlauf */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Blutzucker-Verlauf</h3>
          </div>
          <div className="flex gap-4 text-[10px] mb-3">
            {[{ l: "Morgens", c: C.mint }, { l: "Mittags", c: C.coral }, { l: "Abends", c: C.forest }].map((l) => (
              <div key={l.l} className="flex items-center gap-1">
                <div className="w-3 h-1 rounded" style={{ background: l.c }} />
                <span style={{ color: C.stone }}>{l.l}</span>
              </div>
            ))}
          </div>
          <LineChart
            datasets={[
              { data: BS_MORNING, color: C.mint,   label: "Morgens" },
              { data: BS_MIDDAY,  color: C.coral,   label: "Mittags" },
              { data: BS_EVENING, color: C.forest,  label: "Abends" },
            ]}
            xLabels={WEEK_LABELS}
          />
          <div className="mt-3 flex gap-3 text-xs pt-3 border-t" style={{ borderColor: C.border }}>
            <div><span style={{ color: C.stone }}>Min</span> <b style={{ fontFamily: "'JetBrains Mono',monospace", color: C.mint }}>105</b></div>
            <div><span style={{ color: C.stone }}>Max</span> <b style={{ fontFamily: "'JetBrains Mono',monospace", color: C.coral }}>145</b></div>
            <div><span style={{ color: C.stone }}>Ø</span>  <b style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>118</b></div>
          </div>
        </div>

        {/* Kalorien Trend */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Kalorien-Trend</h3>
          </div>
          <LineChart
            datasets={[
              { data: KCAL_DATA, color: C.coral, label: "Ist" },
              { data: KCAL_DATA.map(() => 2240), color: C.forest, label: "Ziel" },
            ]}
            xLabels={WEEK_LABELS}
          />
          <div className="mt-3 grid grid-cols-2 gap-3 pt-3 border-t text-xs" style={{ borderColor: C.border }}>
            <div>
              <span style={{ color: C.stone }}>Ø täglich</span><br />
              <b style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>1.934 kcal</b>
            </div>
            <div>
              <span style={{ color: C.stone }}>Ziel</span><br />
              <b style={{ fontFamily: "'JetBrains Mono',monospace", color: C.forest }}>2.240 kcal</b>
            </div>
          </div>
        </div>

        {/* Makros stacked */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Makro-Verteilung</h3>
          <div className="flex items-end gap-1 mb-3">
            {WEEK_LABELS.map((d, i) => {
              const total = MACRO_PROT[i] * 4 + MACRO_CARBS[i] * 4 + MACRO_FAT[i] * 9;
              const protH = (MACRO_PROT[i] * 4 / total) * 96;
              const carbH = (MACRO_CARBS[i] * 4 / total) * 96;
              const fatH  = (MACRO_FAT[i] * 9 / total) * 96;
              return (
                <div key={d} className="flex-1 flex flex-col items-center gap-0.5">
                  <div className="w-full flex flex-col" style={{ height: 96 }}>
                    <div style={{ height: protH, background: C.mint,   borderRadius: "4px 4px 0 0" }} />
                    <div style={{ height: carbH, background: C.coral }} />
                    <div style={{ height: fatH,  background: C.forest, borderRadius: "0 0 4px 4px" }} />
                  </div>
                  <span className="text-[8px]" style={{ color: C.stone }}>{d}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 text-[10px]">
            {[{ l: "Protein", c: C.mint }, { l: "Kohlenhydrate", c: C.coral }, { l: "Fett", c: C.forest }].map((l) => (
              <div key={l.l} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ background: l.c }} />
                <span style={{ color: C.stone }}>{l.l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gewicht */}
        <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Gewichtsverlauf</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: C.mintLight, color: C.forest }}>Ziel: 70 kg</span>
          </div>
          <LineChart
            datasets={[
              { data: WEIGHT_DATA, color: C.mint, label: "Gewicht" },
              { data: WEIGHT_DATA.map(() => 70),   color: C.stone, label: "Ziel" },
            ]}
            xLabels={WEEK_LABELS}
          />
          <p className="text-xs mt-2" style={{ color: C.stone }}>Noch <b style={{ color: C.forest }}>2.3 kg</b> bis zum Zielgewicht – weiter so! 💪</p>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-white rounded-2xl border p-5 mb-5" style={{ borderColor: C.border }}>
        <h3 className="font-bold mb-4" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>🤖 KI-Insights</h3>
        <div className="grid md:grid-cols-2 gap-3">
          <Insight icon="🌅" text="Dein Blutzucker ist morgens 12% höher als abends. Versuche ein Low-GI Frühstück wie Haferbrei mit Nüssen." />
          <Insight icon="🍕" text="Du isst am Wochenende durchschnittlich 280 kcal mehr. Ein kleiner Ausgleich unter der Woche würde helfen." />
          <Insight icon="🥦" text="Deine Ballaststoffzufuhr ist bei nur 18g täglich. Ziel sind 30g – füge mehr Hülsenfrüchte und Vollkorn hinzu." />
          <Insight icon="💪" text="An Sporttagen ist dein Blutzucker 15% stabiler. Weiter so – regelmäßige Bewegung macht sich bezahlt!" />
        </div>
      </div>

      {/* BS vs KH Scatter (visual approximation) */}
      <div className="bg-white rounded-2xl border p-5" style={{ borderColor: C.border }}>
        <h3 className="font-bold mb-1" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>Blutzucker-Response nach Rezept</h3>
        <p className="text-xs mb-4" style={{ color: C.stone }}>Kohlenhydrate (g) vs. Blutzucker-Anstieg (mg/dL)</p>
        <svg width="100%" viewBox="0 0 400 160">
          {/* Grid */}
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <line key={f} x1={40} y1={10 + f * 130} x2={390} y2={10 + f * 130} stroke={C.border} strokeWidth="0.5" />
          ))}
          {/* Points */}
          {[
            { carbs: 22, impact: 18, name: "Caesar" },
            { carbs: 28, impact: 21, name: "Gemüse" },
            { carbs: 38, impact: 21, name: "Quinoa S." },
            { carbs: 52, impact: 38, name: "Smoothie" },
            { carbs: 55, impact: 40, name: "Acai" },
            { carbs: 58, impact: 28, name: "Buddha" },
            { carbs: 58, impact: 42, name: "Haferbrei" },
            { carbs: 62, impact: 35, name: "Ceramic" },
            { carbs: 64, impact: 29, name: "Quinoa B." },
          ].map((p, i) => {
            const x = 40 + (p.carbs / 80) * 340;
            const y = 140 - (p.impact / 60) * 130;
            const c = p.impact < 30 ? C.mint : p.impact < 45 ? C.coral : "#D94F3D";
            return (
              <g key={i}>
                <circle cx={x} cy={y} r="5" fill={c} opacity="0.8" />
                <text x={x + 7} y={y + 4} fontSize="8" fill={C.stone}>{p.name}</text>
              </g>
            );
          })}
          {/* Axes */}
          <line x1={40} y1={10} x2={40} y2={145} stroke={C.border} strokeWidth="1" />
          <line x1={40} y1={140} x2={390} y2={140} stroke={C.border} strokeWidth="1" />
          <text x={215} y={158} fontSize="8" fill={C.stone} textAnchor="middle">Kohlenhydrate (g)</text>
          <text x={10} y={80} fontSize="8" fill={C.stone} textAnchor="middle" transform="rotate(-90,10,80)">Anstieg mg/dL</text>
        </svg>
      </div>
    </div>
  );
}
