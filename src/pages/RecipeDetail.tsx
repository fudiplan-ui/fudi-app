import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router";
import { C } from "../shared/colors";
import { RECIPES_DB, RecipeItem } from "../data/recipesDatabase";

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

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const recipe = RECIPES_DB.find((r) => r.id === id) ?? RECIPES_DB[0];
  const [tab, setTab]         = useState<"overview" | "nutrients" | "steps" | "health">("overview");
  const [portions, setPortions] = useState(recipe?.portions || 2);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeStepIdx, setActiveStepIdx] = useState(0);
  const [voiceStatus, setVoiceStatus] = useState<string>("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (recipe) setPortions(recipe.portions);
  }, [recipe?.id]);

  if (!recipe) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: C.forest }}>Rezept nicht gefunden</h2>
          <p className="text-sm mb-4" style={{ color: C.stone }}>Das gewünschte Rezept ist nicht verfügbar.</p>
          <Link to="/rezepte" className="px-5 py-2.5 rounded-xl text-white font-semibold" style={{ background: C.forest }}>
            Zur Rezeptübersicht
          </Link>
        </div>
      </div>
    );
  }

  const factor = portions / recipe.portions;
  const scaledKcal = Math.round(recipe.kcal * factor);
  const scaledP    = Math.round(recipe.protein * factor);
  const scaledC    = Math.round(recipe.carbs * factor);
  const scaledF    = Math.round(recipe.fat * factor);
  const giColor    = recipe.gi === "low" ? C.mint : C.coral;

  const steps = recipe.steps || [];
  const ingredients = recipe.ingredients || [];
  const organBenefit = recipe.organBenefit || {
    organ: recipe.organ,
    effect: "Optimal für einen gesunden Stoffwechsel.",
    highlight: "Stabile Energie und langanhaltendes Sättigungsgefühl."
  };
  const vitaminList = recipe.vitaminList || [
    { label: "Vitamin C", pct: 75 },
    { label: "Magnesium", pct: 60 },
    { label: "Eisen", pct: 40 }
  ];

  const speakCurrentStep = (stepIndex: number) => {
    if (!('speechSynthesis' in window)) {
      alert("Sprachausgabe wird von diesem Browser leider nicht unterstützt.");
      return;
    }
    window.speechSynthesis.cancel();
    if (stepIndex < 0 || stepIndex >= steps.length) return;

    setActiveStepIdx(stepIndex);
    const stepText = `Schritt ${stepIndex + 1}: ${steps[stepIndex]}`;
    const utter = new SpeechSynthesisUtterance(stepText);
    utter.lang = "de-DE";
    utter.rate = 0.95;

    utter.onstart = () => {
      setIsSpeaking(true);
      setVoiceStatus(`Liest Schritt ${stepIndex + 1} vor...`);
    };
    utter.onend = () => {
      setIsSpeaking(false);
      setVoiceStatus(`Schritt ${stepIndex + 1} beendet. Sag "Weiter", "Wiederholen" oder "Stopp".`);
    };
    utter.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utter);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setVoiceStatus("");
  };

  const toggleVoiceAssistant = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sprachsteuerung wird in diesem Browser leider nicht unterstützt (Empfohlen: Chrome / Safari).");
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      stopSpeaking();
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      setVoiceStatus(`Befehl erkannt: "${transcript}"`);

      if (transcript.includes("weiter") || transcript.includes("nächster") || transcript.includes("vor")) {
        setActiveStepIdx((prev) => {
          const next = Math.min(prev + 1, steps.length - 1);
          speakCurrentStep(next);
          return next;
        });
      } else if (transcript.includes("zurück") || transcript.includes("vorheriger")) {
        setActiveStepIdx((prev) => {
          const back = Math.max(prev - 1, 0);
          speakCurrentStep(back);
          return back;
        });
      } else if (transcript.includes("wiederhol") || transcript.includes("nochmal")) {
        speakCurrentStep(activeStepIdx);
      } else if (transcript.includes("stopp") || transcript.includes("halt") || transcript.includes("pause") || transcript.includes("aus")) {
        stopSpeaking();
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    recognitionRef.current = recognition;
    setIsListening(true);
    setVoiceStatus("FUDI Koch-Assistent aktiv. Sag z. B. 'Weiter' oder 'Wiederholen'!");
    speakCurrentStep(activeStepIdx);
  };

  return (
    <div className="min-h-screen" style={{ background: C.sandLight }}>
      {/* Top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/90 backdrop-blur-md border-b" style={{ borderColor: C.border }}>
        <Link to="/rezepte" className="flex items-center gap-1 text-sm font-semibold hover:opacity-80" style={{ color: C.forest }}>
          <span>‹</span> Alle Rezepte
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/planer" className="text-xs font-semibold px-3 py-1.5 rounded-lg border hover:bg-gray-50" style={{ borderColor: C.border, color: C.stone }}>
            📅 In Wochenplan
          </Link>
          <Link to="/einkauf" className="text-xs font-bold text-white px-3 py-1.5 rounded-lg shadow-xs hover:opacity-90" style={{ background: C.forest }}>
            🛒 Zutaten auf Einkaufsliste
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Main hero card */}
        <div className="bg-white rounded-3xl overflow-hidden border shadow-sm" style={{ borderColor: C.border }}>
          <div className="relative h-64 md:h-80 w-full overflow-hidden bg-gray-100">
            <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap gap-1.5 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md">
                  {recipe.tag} · {recipe.country}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/80">
                  {recipe.diet}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/80">
                  {recipe.vitamins}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black leading-tight mb-2 drop-shadow-sm">
                {recipe.title}
              </h1>
              <div className="flex items-center gap-4 text-xs font-medium text-white/90">
                <span>⏱ {recipe.time} Min.</span>
                <span>·</span>
                <Stars rating={recipe.rating} />
                <span>·</span>
                <span>📍 GI: <b className="uppercase">{recipe.gi}</b> (+{recipe.impact} mg/dL)</span>
              </div>
            </div>
          </div>

          {/* Key Metric strip */}
          <div className="grid grid-cols-4 divide-x border-b text-center py-3 bg-gray-50/70" style={{ borderColor: C.border }}>
            <div>
              <p className="text-[11px] text-gray-500">Brennwert</p>
              <p className="text-base font-extrabold font-mono" style={{ color: C.forest }}>{scaledKcal} <span className="text-[10px] font-normal">kcal</span></p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Protein</p>
              <p className="text-base font-extrabold font-mono text-emerald-700">{scaledP}g</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Kohlenhydrate</p>
              <p className="text-base font-extrabold font-mono text-amber-600">{scaledC}g</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-500">Fett</p>
              <p className="text-base font-extrabold font-mono text-blue-600">{scaledF}g</p>
            </div>
          </div>

          {/* Voice Cooking Assistant banner */}
          <div className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 rounded-xl bg-white/10">🎙️</span>
              <div>
                <h2 className="text-sm font-bold">FUDI Smart-Voice Küchenchef</h2>
                <p className="text-xs text-white/80">
                  {voiceStatus || 'Hands-free Kochen: "Weiter", "Wiederholen" oder "Stopp" sagen.'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceAssistant}
                className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all ${
                  isListening ? "bg-red-500 hover:bg-red-600 animate-pulse text-white" : "bg-emerald-500 hover:bg-emerald-600 text-white"
                }`}
              >
                <span>{isListening ? "🔴 Zuhören beenden" : "🎤 Sprach-Assistent starten"}</span>
              </button>
              {isSpeaking && (
                <button onClick={stopSpeaking} className="text-xs bg-white/20 hover:bg-white/30 px-3 py-2 rounded-xl">
                  Stumm
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b text-xs font-bold overflow-x-auto" style={{ borderColor: C.border }}>
            {[
              { id: "overview", label: "Zutaten & Portionen" },
              { id: "steps", label: "Schritt-für-Schritt" },
              { id: "nutrients", label: "Blutzucker & Makros" },
              { id: "health", label: "Organ-Benefit & Mikronährstoffe" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as any)}
                className={`px-4 py-3 border-b-2 whitespace-nowrap transition-colors ${
                  tab === t.id
                    ? "border-emerald-700 text-emerald-800 font-extrabold bg-emerald-50/50"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border" style={{ borderColor: C.border }}>
                  <span className="text-xs font-bold" style={{ color: C.forest }}>Portionen anpassen:</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setPortions(Math.max(1, portions - 1))}
                      className="w-7 h-7 rounded-lg bg-white border font-bold text-sm flex items-center justify-center hover:bg-gray-100 shadow-xs"
                      style={{ borderColor: C.border }}
                    >
                      -
                    </button>
                    <span className="font-extrabold text-sm font-mono">{portions}</span>
                    <button
                      onClick={() => setPortions(portions + 1)}
                      className="w-7 h-7 rounded-lg bg-white border font-bold text-sm flex items-center justify-center hover:bg-gray-100 shadow-xs"
                      style={{ borderColor: C.border }}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Zutatenliste</h3>
                  <ul className="divide-y rounded-2xl border bg-white overflow-hidden" style={{ borderColor: C.border }}>
                    {ingredients.map((ing, idx) => (
                      <li key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50/50">
                        <span className="font-medium text-gray-800">{ing.name}</span>
                        <span className="font-mono font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                          {scaleAmount(ing.amount, factor)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Chef Tip */}
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
                  <span className="text-xl">👨‍🍳</span>
                  <div>
                    <h4 className="font-bold mb-0.5">FUDI Küchenchef-Tipp</h4>
                    <p className="leading-relaxed">{recipe.chefTip}</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "steps" && (
              <div className="space-y-4">
                {steps.map((st, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border transition-all ${
                      activeStepIdx === idx
                        ? "bg-emerald-50/80 border-emerald-400 shadow-sm ring-2 ring-emerald-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-slate-800 text-white font-mono">
                        Schritt {idx + 1}
                      </span>
                      <button
                        onClick={() => speakCurrentStep(idx)}
                        className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>🔊 Vorlesen</span>
                      </button>
                    </div>
                    <p className="text-xs md:text-sm text-gray-800 leading-relaxed font-medium">
                      {st}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {tab === "nutrients" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Simulierte Glukosekurve</h3>
                  <div className="p-4 rounded-2xl border bg-gray-50/60" style={{ borderColor: C.border }}>
                    <BsCurve impact={recipe.impact} color={giColor} />
                    <div className="flex justify-between text-[11px] text-gray-500 mt-2 font-mono">
                      <span>Nüchtern: 112 mg/dL</span>
                      <span className="font-bold text-amber-700">Peak: ~{112 + recipe.impact} mg/dL</span>
                      <span>2h postprandial: ~115 mg/dL</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Makronährstoff-Verteilung</h3>
                  <MacroBar label="Protein" val={scaledP} max={120} color="#10b981" />
                  <MacroBar label="Kohlenhydrate" val={scaledC} max={150} color="#f59e0b" />
                  <MacroBar label="Gesunde Fette" val={scaledF} max={80} color="#3b82f6" />
                </div>
              </div>
            )}

            {tab === "health" && (
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">🫀</span>
                    <h3 className="font-bold text-sm">Gezielter Organ-Benefit: {organBenefit.organ}</h3>
                  </div>
                  <p className="mb-2 leading-relaxed">{organBenefit.effect}</p>
                  <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/60 p-2 rounded-xl">
                    ✨ {organBenefit.highlight}
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                    Mikronährstoff- & Vitaminabdeckung (Tagesbedarf % RDA)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {vitaminList.map((v, i) => (
                      <div key={i} className="p-3 rounded-xl border bg-white" style={{ borderColor: C.border }}>
                        <p className="text-xs font-semibold text-gray-700 mb-1">{v.label}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 h-1.5 rounded-full bg-gray-100 mr-2 overflow-hidden">
                            <div className="h-full rounded-full bg-emerald-600" style={{ width: `${Math.min(v.pct, 100)}%` }} />
                          </div>
                          <span className="text-xs font-mono font-bold text-emerald-700">{v.pct}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Allergens Notice */}
                <div className="p-3 rounded-xl bg-gray-50 border text-[11px] text-gray-600" style={{ borderColor: C.border }}>
                  <span className="font-bold">Allergene & Unverträglichkeiten: </span>
                  <span>{recipe.allergies.join(", ")}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
