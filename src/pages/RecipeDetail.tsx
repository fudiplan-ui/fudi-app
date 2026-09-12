import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES } from "../shared/images";

function scaleAmount(amount: string, scale: number): string {
  if (scale === 1) return amount;
  const normalised = amount
    .replace("1/2", "0.5").replace("1/4", "0.25").replace("3/4", "0.75");
  const match = normalised.match(/^([\d.]+)\s*(.*)/);
  if (!match) return amount;
  const num  = parseFloat(match[1]);
  const unit = match[2].trim();
  const result = num * scale;
  const formatted = Number.isInteger(result) ? result.toString() : result.toFixed(1).replace(/\.0$/, "");
  return unit ? `${formatted} ${unit}` : formatted;
}

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

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map((s) => (
        <span key={s} className="text-sm" style={{ color: s <= Math.round(rating) ? "#f59e0b" : C.border }}>★</span>
      ))}
      <span className="text-xs ml-1.5 font-semibold" style={{ color: C.stone }}>{rating.toFixed(1)}</span>
    </div>
  );
}

// Rich ingredients and steps database per recipe ID
const RECIPE_DATA_MAP: Record<string, { ingredients: { name: string; amount: string }[]; steps: string[]; vitamins: { label: string; pct: number }[] }> = {
  "1": {
    ingredients: [
      { name: "Quinoa (gekocht)", amount: "150g" },
      { name: "Kichererbsen (gekocht)", amount: "100g" },
      { name: "Rote Paprika", amount: "1 Stück" },
      { name: "Gurke", amount: "0.5 Stück" },
      { name: "Kirschtomaten", amount: "8 Stück" },
      { name: "Avocado", amount: "0.5 Stück" },
      { name: "Tahini (Sesammus)", amount: "2 EL" },
      { name: "Frischer Zitronensaft", amount: "2 EL" },
      { name: "Natives Olivenöl", amount: "1 EL" },
    ],
    steps: [
      "Quinoa gründlich mit heißem Wasser abspülen und in leicht gesalzenem Wasser ca. 15 Minuten quellen lassen.",
      "Kichererbsen abgießen, trocken tupfen und in einer Pfanne mit Paprikapulver und Kreuzkümmel 5 Min. knusprig anrösten.",
      "Gemüse waschen: Paprika und Gurke würfeln, Kirschtomaten halbieren, Avocado in zarte Spalten schneiden.",
      "Für das Dressing Tahini mit Zitronensaft, etwas lauwarmem Wasser, Salz und Pfeffer cremig rühren.",
      "Zutaten in einer Schüssel nebeneinander anrichten, mit Tahini-Dressing beträufeln und mit geröstetem Sesam toppen.",
    ],
    vitamins: [
      { label: "Vitamin C", pct: 85 }, { label: "Vitamin K", pct: 60 },
      { label: "Eisen", pct: 36 }, { label: "Magnesium", pct: 32 },
      { label: "Kalzium", pct: 18 }, { label: "Zink", pct: 24 },
    ]
  },
  "2": {
    ingredients: [
      { name: "Hähnchenbrustfilet (Bio)", amount: "250g" },
      { name: "Römersalat-Herzen", amount: "2 Köpfe" },
      { name: "Parmesan (Parmigiano Reggiano)", amount: "40g" },
      { name: "Vollkorn-Croutons", amount: "40g" },
      { name: "Griechischer Joghurt 0% (Dressing-Basis)", amount: "3 EL" },
      { name: "Dijon-Senf & Knoblauch", amount: "1 TL" },
      { name: "Natives Olivenöl", amount: "1 EL" },
      { name: "Zitronensaft", amount: "1 EL" },
    ],
    steps: [
      "Hähnchenbrust mit Salz, Pfeffer und Knoblauch einreiben. In einer Grillpfanne von jeder Seite ca. 5–6 Min. braten.",
      "Römersalat waschen, gut trockenschleudern und in mundgerechte Stücke schneiden.",
      "Für das leichte Low-Cal Caesar-Dressing Joghurt, Senf, Zitronensaft, geriebenen Knoblauch und einen Spritzer Olivenöl glattrühren.",
      "Salat mit dem Dressing mischen, warmes Hähnchen in Tranchen schneiden und darauflegen.",
      "Mit frisch gehobeltem Parmesan und Vollkorn-Croutons garnieren.",
    ],
    vitamins: [
      { label: "Vitamin A", pct: 95 }, { label: "Vitamin B6", pct: 70 },
      { label: "Niacin", pct: 65 }, { label: "Kalzium", pct: 28 },
      { label: "Eisen", pct: 20 }, { label: "Zink", pct: 30 },
    ]
  },
  "6": {
    ingredients: [
      { name: "Wildlachsfilet (frisch)", amount: "300g" },
      { name: "Zarter grüner Spargel", amount: "200g" },
      { name: "Fenchelknolle", amount: "1 Stück" },
      { name: "Kirschtomaten am Strauch", amount: "150g" },
      { name: "Natives Olivenöl", amount: "1.5 EL" },
      { name: "Frischer Rosmarin & Thymian", amount: "2 Zweige" },
      { name: "Bio-Zitrone", amount: "1 Stück" },
    ],
    steps: [
      "Lachs trocken tupfen, mit Meersalz und Pfeffer würzen und die Hautseite leicht einritzen.",
      "Spargelenden abbrechen, Fenchel in feine Scheiben hobeln.",
      "In einer beschichteten Pfanne etwas Olivenöl erhitzen, Lachs auf der Hautseite bei mittlerer Hitze 4 Min. kross anbraten.",
      "Gemüse dazugeben, Lachs wenden und Kräuterzweige einlegen. 3–4 Min. sanft garziehen lassen.",
      "Mit frischem Zitronensaft beträufeln und sofort servieren. Liefert über 3000mg entzündungshemmende Omega-3-Fettsäuren.",
    ],
    vitamins: [
      { label: "Vitamin D", pct: 100 }, { label: "Vitamin B12", pct: 95 },
      { label: "Selen", pct: 88 }, { label: "Omega-3", pct: 100 },
      { label: "Kalium", pct: 35 }, { label: "Magnesium", pct: 40 },
    ]
  },
  "13": {
    ingredients: [
      { name: "Magerquark (speisefrisch)", amount: "250g" },
      { name: "Eier (Größe M)", amount: "2 Stück" },
      { name: "Zarte Haferflocken (gemahlen)", amount: "40g" },
      { name: "Backpulver", amount: "0.5 TL" },
      { name: "Frische Heidelbeeren", amount: "80g" },
      { name: "Zimt & Bourbon-Vanille", amount: "1 Prise" },
      { name: "Kokosöl zum Braten", amount: "1 TL" },
    ],
    steps: [
      "Magerquark, Eier, gemahlene Haferflocken, Backpulver und Vanille mit dem Schneebesen zu einem geschmeidigen Teig verrühren.",
      "Pfanne auf mittlerer Stufe erhitzen und mit etwas Kokosöl einpinseln.",
      "Jeweils 2 Esslöffel Teig pro Pancake in die Pfanne geben, mit einigen Heidelbeeren belegen.",
      "Von jeder Seite ca. 2 bis 3 Minuten goldbraun backen, bis sich kleine Bläschen bilden.",
      "Warm servieren – liefert 42g biologisch hochwertiges Protein bei minimalem Blutzuckeranstieg!",
    ],
    vitamins: [
      { label: "Vitamin B12", pct: 80 }, { label: "Riboflavin", pct: 60 },
      { label: "Kalzium", pct: 45 }, { label: "Phosphor", pct: 40 },
      { label: "Zink", pct: 25 }, { label: "Eisen", pct: 18 },
    ]
  },
  "14": {
    ingredients: [
      { name: "Frische Freilandeier", amount: "3 Stück" },
      { name: "Gehackte Tomaten (Dose)", amount: "400g" },
      { name: "Rote Paprika", amount: "1 Stück" },
      { name: "Zwiebel & Knoblauchzehe", amount: "1 Stück" },
      { name: "Feta (Schafskäse)", amount: "50g" },
      { name: "Kreuzkümmel (Cumin) & Koriander", amount: "1 TL" },
      { name: "Frische Petersilie", amount: "1 Handvoll" },
    ],
    steps: [
      "Zwiebel, Knoblauch und Paprika würfeln und in Olivenöl anschwitzen, bis sie weich sind.",
      "Gewürze (Kreuzkümmel, Paprikapulver edelsüß) hinzufügen und kurz mitrösten.",
      "Mit Tomaten ablöschen und die Sauce 10 Min. einköcheln lassen, mit Salz und Chili abschmecken.",
      "Mit einem Löffel drei Mulden in die Sauce drücken und die Eier hineinschlagen.",
      "Deckel auflegen und bei milder Hitze ca. 6–8 Min. stocken lassen. Mit Feta und Petersilie bestreuen.",
    ],
    vitamins: [
      { label: "Lycopin", pct: 100 }, { label: "Vitamin C", pct: 90 },
      { label: "Cholin", pct: 75 }, { label: "Vitamin A", pct: 50 },
      { label: "Eisen", pct: 30 }, { label: "Kalzium", pct: 22 },
    ]
  },
  "15": {
    ingredients: [
      { name: "Räuchertofu oder Naturtofu", amount: "200g" },
      { name: "Brokkoliröschen", amount: "200g" },
      { name: "Karotte", amount: "1 Stück" },
      { name: "Zuckerschoten", amount: "100g" },
      { name: "Natürliche Erdnussbutter (100%)", amount: "2 EL" },
      { name: "Sojasauce (Tamari)", amount: "2 EL" },
      { name: "Frischer Ingwer & Knoblauch", amount: "1 EL" },
    ],
    steps: [
      "Tofu trockenpressen, in Würfel schneiden und in Maisstärke wälzen.",
      "Im heißen Wok mit etwas Sesamöl von allen Seiten 6 Min. kross anbraten, dann herausnehmen.",
      "Brokkoli, Karottenscheiben und Zuckerschoten im Wok 4 Min. bissfest pfannenrühren.",
      "Erdnussbutter mit Tamari, warmem Wasser, Limettensaft und geriebenem Ingwer zur Sauce verrühren.",
      "Tofu zurück in den Wok geben, Sauce unterrühren und 1 Minute glasieren. Auf Wunsch mit Sesam toppen.",
    ],
    vitamins: [
      { label: "Vitamin C", pct: 100 }, { label: "Vitamin K", pct: 90 },
      { label: "Magnesium", pct: 45 }, { label: "Eisen", pct: 38 },
      { label: "Kalzium", pct: 35 }, { label: "Zink", pct: 28 },
    ]
  }
};

const DEFAULT_INGREDIENTS = [
  { name: "Quinoa / Vollkornbasis", amount: "120g" },
  { name: "Saisonales Frischgemüse", amount: "200g" },
  { name: "Proteinquelle (Hähnchen, Lachs, Tofu)", amount: "150g" },
  { name: "Kaltgepresstes Olivenöl", amount: "1 EL" },
  { name: "Frische Gartenkräuter", amount: "1 Handvoll" },
  { name: "Meersalz & bunter Pfeffer", amount: "nach Geschmack" },
];

const DEFAULT_STEPS = [
  "Alle frischen Zutaten abwiegen, waschen und in mundgerechte Stücke vorbereiten.",
  "Die Kohlenhydrat- bzw. Vollkornbasis schonend in leicht gesalzenem Wasser dämpfen oder kochen.",
  "Die Proteinkomponente mit hochwertigen Gewürzen und wenig Öl bei mittlerer Hitze garen.",
  "Ein leichtes Dressing aus Zitrone, Kräutern und gesundem Öl anrühren.",
  "Alles harmonisch in einer Schale anrichten und sofort genießen.",
];

const DEFAULT_VITAMINS = [
  { label: "Vitamin C", pct: 65 }, { label: "Vitamin B-Komplex", pct: 50 },
  { label: "Eisen", pct: 28 }, { label: "Magnesium", pct: 30 },
  { label: "Kalzium", pct: 20 }, { label: "Zink", pct: 25 },
];

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = RECIPES.find((r) => r.id === id) ?? RECIPES[0];
  const [tab, setTab]         = useState<"overview" | "nutrients" | "steps">("overview");
  const [portions, setPortions] = useState(recipe.portions);

  useEffect(() => {
    setPortions(recipe.portions);
  }, [recipe.id, recipe.portions]);

  const factor = portions / recipe.portions;
  const currentData = (id && RECIPE_DATA_MAP[id]) ? RECIPE_DATA_MAP[id] : {
    ingredients: DEFAULT_INGREDIENTS,
    steps: DEFAULT_STEPS,
    vitamins: DEFAULT_VITAMINS
  };

  const scaledKcal = Math.round(recipe.kcal * factor);
  const scaledP    = Math.round(recipe.protein * factor);
  const scaledC    = Math.round(recipe.carbs * factor);
  const scaledF    = Math.round(recipe.fat * factor);

  const giColor = recipe.gi === "low" ? C.mint : C.coral;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/rezepte" className="inline-flex items-center gap-1.5 text-xs mb-4 font-semibold hover:underline" style={{ color: C.stone }}>
        ← Zurück zu Rezepten
      </Link>

      <div className="bg-white rounded-3xl overflow-hidden border mb-6 shadow-sm" style={{ borderColor: C.border }}>
        <div className="h-64 relative overflow-hidden" style={{ background: C.mintLight }}>
          <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white shadow-sm" style={{ background: giColor }}>
              {recipe.gi === "low" ? "Low GI (Blutzuckerschonend)" : "Medium GI"}
            </span>
          </div>
          <div className="absolute top-4 right-4">
            <span className="text-xs font-bold px-3 py-1 rounded-full text-white backdrop-blur-md" style={{ background: "rgba(0,0,0,0.5)" }}>
              {recipe.tag}
            </span>
          </div>
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-black mb-2" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest }}>
            {recipe.title}
          </h1>

          <div className="flex items-center justify-between pb-4 border-b mb-5" style={{ borderColor: C.border }}>
            <Stars rating={recipe.rating} />
            <div className="flex items-center gap-3 text-xs" style={{ color: C.stone }}>
              <span>⏱ {recipe.time} Min.</span>
              <span>🔥 {scaledKcal} kcal</span>
              <span className="font-bold" style={{ color: C.mint }}>+{recipe.impact} mg/dL</span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-3 mb-6">
            <span className="text-xs font-bold" style={{ color: C.forest }}>Portionen anpassen:</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setPortions(Math.max(1, portions - 1))}
                className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-sm shadow-sm active:scale-95"
                style={{ borderColor: C.border, color: C.forest }}
              >-</button>
              <span className="text-sm font-black w-6 text-center" style={{ color: C.forest }}>{portions}</span>
              <button
                onClick={() => setPortions(portions + 1)}
                className="w-8 h-8 rounded-full bg-white border flex items-center justify-center font-bold text-sm shadow-sm active:scale-95"
                style={{ borderColor: C.border, color: C.forest }}
              >+</button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b mb-6" style={{ borderColor: C.border }}>
            {[
              { key: "overview", label: "Zutaten" },
              { key: "steps", label: "Zubereitung" },
              { key: "nutrients", label: "Nährwerte & Glukose" }
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as any)}
                className="flex-1 py-2.5 text-xs font-bold transition-all border-b-2"
                style={{
                  color: tab === t.key ? C.forest : C.stone,
                  borderColor: tab === t.key ? C.mint : "transparent"
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {tab === "overview" && (
            <div>
              <h3 className="text-sm font-black mb-3" style={{ color: C.forest }}>Frische Zutaten</h3>
              <div className="space-y-2">
                {currentData.ingredients.map((ing, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 rounded-xl bg-gray-50 text-xs">
                    <span className="font-medium" style={{ color: C.ink }}>{ing.name}</span>
                    <span className="font-bold font-mono" style={{ color: C.mint }}>{scaleAmount(ing.amount, factor)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "steps" && (
            <div>
              <h3 className="text-sm font-black mb-3" style={{ color: C.forest }}>Schritt-für-Schritt Zubereitung</h3>
              <div className="space-y-4">
                {currentData.steps.map((st, i) => (
                  <div key={i} className="flex gap-3 text-xs leading-relaxed">
                    <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center font-bold text-white text-[11px]" style={{ background: C.forest }}>
                      {i + 1}
                    </span>
                    <span className="pt-0.5" style={{ color: C.ink }}>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === "nutrients" && (
            <div className="space-y-5">
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="text-xs font-bold mb-3" style={{ color: C.stone }}>Makronährstoff-Verteilung ({portions} Port.)</h3>
                <div className="space-y-2.5">
                  <MacroBar label="Protein" val={scaledP} max={60} color="#10b981" />
                  <MacroBar label="Kohlenhydrate" val={scaledC} max={80} color="#f59e0b" />
                  <MacroBar label="Gesunde Fette" val={scaledF} max={50} color="#6366f1" />
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xs font-bold" style={{ color: C.stone }}>Blutzucker-Reaktion (Glukose-Impact)</h3>
                  <span className="text-xs font-bold font-mono" style={{ color: giColor }}>+{recipe.impact} mg/dL</span>
                </div>
                <BsCurve impact={recipe.impact} color={giColor} />
                <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                  Dieser Wert prognostiziert den maximalen Glukoseanstieg nach Verzehr. Werte unter +30 mg/dL verhindern Insulinfetzen und Heißhungerattacken.
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold mb-2.5" style={{ color: C.stone }}>Mikronährstoffe (% Tagesbedarf)</h3>
                <div className="grid grid-cols-2 gap-2">
                  {currentData.vitamins.map((v, i) => (
                    <div key={i} className="flex justify-between items-center p-2 rounded-xl border text-xs" style={{ borderColor: C.border }}>
                      <span style={{ color: C.ink }}>{v.label}</span>
                      <span className="font-bold font-mono" style={{ color: C.mint }}>{v.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}