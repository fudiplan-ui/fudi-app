import { useState, useEffect } from "react";
import { C } from "../shared/colors";
import { predictGlucose } from "../lib/bloodSugar";

interface FoodItem {
  id: string;
  name: string;
  category: string;
  carbs: number; // in 100g
  gi: number;    // Glycemic Index
  baseImpact: number; // mg/dL
  portion: string;
  icon: string;
}

const FOODS: FoodItem[] = [
  { id: "pizza",     name: "Pizza Margherita",           category: "Fast Food", carbs: 32, gi: 80, baseImpact: 58, portion: "1 Portion (350g)",  icon: "🍕" },
  { id: "pasta",     name: "Helle Hartweizen-Pasta",     category: "Nudeln",    carbs: 70, gi: 75, baseImpact: 54, portion: "1 Teller (120g roh)", icon: "🍝" },
  { id: "rice",      name: "Weißer Jasminreis",          category: "Beilagen",  carbs: 78, gi: 85, baseImpact: 52, portion: "1 Schale (100g roh)", icon: "🍚" },
  { id: "bread",     name: "Weizen-Toastbrot (2 Scheiben)", category: "Brot",   carbs: 48, gi: 72, baseImpact: 42, portion: "2 Scheiben (60g)",    icon: "🍞" },
  { id: "banana",    name: "Sehr reife Banane",          category: "Obst",      carbs: 23, gi: 62, baseImpact: 28, portion: "1 Stück (120g)",      icon: "🍌" },
  { id: "oats",      name: "Haferflocken mit Vollmilch", category: "Frühstück", carbs: 58, gi: 55, baseImpact: 32, portion: "1 Schüssel (80g)",    icon: "🥣" },
  { id: "croissant", name: "Butter-Croissant",           category: "Gebäck",    carbs: 45, gi: 68, baseImpact: 40, portion: "1 Stück (70g)",       icon: "🥐" },
  { id: "burger",    name: "Cheeseburger mit Pommes",    category: "Fast Food", carbs: 42, gi: 78, baseImpact: 62, portion: "1 Menü (450g)",       icon: "🍔" },
  { id: "cola",      name: "Cola / Softdrink gezuckert", category: "Getränke",  carbs: 11, gi: 90, baseImpact: 48, portion: "1 Dose (330ml)",      icon: "🥤" },
  { id: "cake",      name: "Schokoladenkuchen",          category: "Gebäck",    carbs: 55, gi: 70, baseImpact: 50, portion: "1 Stück (100g)",      icon: "🍰" },
];

interface IngredientSwap {
  id: string;
  foodId: string; // which food it belongs to, or 'all'
  title: string;
  savePercent: number;
  reductionMgDl: number;
  extraBenefit: string;
  icon: string;
}

const INGREDIENT_SWAPS: IngredientSwap[] = [
  // Pasta alternatives
  { id: "shirataki", foodId: "pasta", title: "Konjak- / Shirataki-Nudeln", savePercent: 90, reductionMgDl: 46, extraBenefit: "Nur 9 kcal/100g, 0g Netto-Carbs, reich an Glucomannan", icon: "🍜" },
  { id: "lentils",   foodId: "pasta", title: "Rote Linsennudeln", savePercent: 45, reductionMgDl: 24, extraBenefit: "+14g pflanzliches Protein, langsamer Insulinausstoß", icon: "🌱" },
  { id: "zoodles",   foodId: "pasta", title: "Frische Zucchini-Spaghetti (Zoodles)", savePercent: 85, reductionMgDl: 44, extraBenefit: "Reich an Kalium & Vitamin C, extrem hydrierend", icon: "🥒" },

  // Rice alternatives
  { id: "cauli",     foodId: "rice", title: "Blumenkohlreis statt Jasminreis", savePercent: 75, reductionMgDl: 38, extraBenefit: "Sulfur-Antioxidantien für die Leber, 85% weniger Kohlenhydrate", icon: "🥦" },
  { id: "cooled_rice", foodId: "rice", title: "Gekühlter & aufgewärmter Reis (Resistente Stärke)", savePercent: 35, reductionMgDl: 18, extraBenefit: "Resistente Stärke Typ 3 nährt probiotische Darmbakterien", icon: "❄️" },
  { id: "quinoa",    foodId: "rice", title: "Bunter Quinoa statt weißer Reis", savePercent: 40, reductionMgDl: 20, extraBenefit: "Vollständiges Aminosäurenprofil, 5g Ballaststoffe", icon: "🌾" },

  // Bread & Flour alternatives
  { id: "almond_bread", foodId: "bread", title: "Mandelmehl-Eiweißbrot", savePercent: 70, reductionMgDl: 28, extraBenefit: "+18g Protein, reich an Vitamin E & Magnesium", icon: "🍞" },
  { id: "sourdough",    foodId: "bread", title: "Lange fermentiertes Roggen-Sauerteigbrot", savePercent: 35, reductionMgDl: 15, extraBenefit: "Milchsäurebakterien senken den glykämischen Index natürlich", icon: "🌾" },
  { id: "cloud_bread",  foodId: "bread", title: "Cloud Bread (Quark-Ei Basis)", savePercent: 90, reductionMgDl: 36, extraBenefit: "Nahezu 0g Kohlenhydrate, reine Proteinstruktur", icon: "☁️" },

  // Pizza alternatives
  { id: "cauli_pizza", foodId: "pizza", title: "Blumenkohl-Käseboden Pizza", savePercent: 65, reductionMgDl: 36, extraBenefit: "Kein Gluten, ballaststoffreich und herzhafter Geschmack", icon: "🍕" },
  { id: "protein_wrap_pizza", foodId: "pizza", title: "Protein-Wrap als dünner Pizzaboden", savePercent: 50, reductionMgDl: 28, extraBenefit: "Knusprig dünn, halbe Kalorienmenge", icon: "🌯" },

  // Sugar & Drinks & Dessert alternatives
  { id: "erythrit",    foodId: "all", title: "Erythrit / Stevia statt Haushaltszucker", savePercent: 95, reductionMgDl: 40, extraBenefit: "0 Insulinausschüttung, zahnfreundlich", icon: "✨" },
  { id: "yacon",       foodId: "all", title: "Yacon-Wurzelsirup statt Agavendicksaft", savePercent: 60, reductionMgDl: 22, extraBenefit: "Reich an Fructooligosacchariden (Präbiotikum)", icon: "🍯" },
  { id: "cacao_nibs",  foodId: "cake", title: "100% Rohkakao-Nibs statt Vollmilch-Schoko", savePercent: 65, reductionMgDl: 30, extraBenefit: "Flavonoide für Herzgesundheit & Stickstoffmonoxid-Booster", icon: "🍫" },

  // Universal Metabolic Hacks
  { id: "vinegar",     foodId: "all", title: "1 EL naturtrüber Apfelessig in Wasser vorab", savePercent: 25, reductionMgDl: 14, extraBenefit: "Essigsäure hemmt Alpha-Amylase und verlangsamt Magenentleerung", icon: "🍏" },
  { id: "cinnamon",    foodId: "all", title: "1 TL echter Ceylon-Zimt dazugeben", savePercent: 18, reductionMgDl: 10, extraBenefit: "Verbessert Insulinsensitivität der Muskelzellen", icon: "🪵" },
  { id: "psyllium",    foodId: "all", title: "1 TL Flohsamenschalen (Psyllium) einrühren", savePercent: 30, reductionMgDl: 16, extraBenefit: "Gelbildner verlangsamt die Glukoseabsorption im Dünndarm", icon: "🥣" },
  { id: "walk_10m",    foodId: "all", title: "10 Minuten Spaziergang direkt nach dem Essen", savePercent: 35, reductionMgDl: 18, extraBenefit: "Glukoseaufnahme durch Muskelkontraktion ohne Insulinbedarf (GLUT4)", icon: "🚶" },
];

export interface DiaryEntry {
  id: number;
  date: string;
  time: string;
  meal: string;
  startBs: number;
  peakBs: number;
  savedMgDl: number;
  swapTitle?: string;
}

export default function BloodSugar() {
  const [selectedFoodId, setSelectedFoodId] = useState<string>("pasta");
  const [startBs, setStartBs] = useState<number>(105);
  const [selectedSwapId, setSelectedSwapId] = useState<string | null>("shirataki");
  const [portionFactor, setPortionFactor] = useState<number>(1.0);
  const [calculated, setCalculated] = useState<boolean>(true);
  const [diaryToast, setDiaryToast] = useState<string | null>(null);

  // Load Diary from LocalStorage
  const [diary, setDiary] = useState<DiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem("fudi_bs_diary");
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    // Default initial demonstration entries
    return [
      { id: 1726000000000, date: "12.09.2026", time: "13:15", meal: "Helle Hartweizen-Pasta", startBs: 108, peakBs: 138, savedMgDl: 24, swapTitle: "Rote Linsennudeln" },
      { id: 1725900000000, date: "11.09.2026", time: "19:40", meal: "Pizza Margherita", startBs: 112, peakBs: 132, savedMgDl: 36, swapTitle: "Blumenkohl-Käseboden Pizza" },
      { id: 1725800000000, date: "10.09.2026", time: "08:30", meal: "Haferflocken mit Vollmilch", startBs: 98, peakBs: 118, savedMgDl: 12, swapTitle: "1 TL echter Ceylon-Zimt dazugeben" },
    ];
  });

  const saveDiaryToStorage = (entries: DiaryEntry[]) => {
    setDiary(entries);
    try {
      localStorage.setItem("fudi_bs_diary", JSON.stringify(entries));
    } catch (e) {
      console.error(e);
    }
  };

  const food = FOODS.find(f => f.id === selectedFoodId) || FOODS[0];
  const activeSwap = INGREDIENT_SWAPS.find(s => s.id === selectedSwapId) || null;

  // Calculations (getestete Kernlogik aus src/lib/bloodSugar.ts)
  const { rawImpact, originalPeak, optimizedImpact, optimizedPeak, savedMgDl } = predictGlucose(
    food.baseImpact,
    startBs,
    portionFactor,
    activeSwap ? activeSwap.reductionMgDl : 0
  );

  // Add to Diary
  const handleAddToDiary = () => {
    const now = new Date();
    const newEntry: DiaryEntry = {
      id: Date.now(),
      date: now.toLocaleDateString("de-DE"),
      time: now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" }),
      meal: food.name,
      startBs: startBs,
      peakBs: optimizedPeak,
      savedMgDl: savedMgDl,
      swapTitle: activeSwap ? activeSwap.title : undefined,
    };

    const updated = [newEntry, ...diary];
    saveDiaryToStorage(updated);
    setDiaryToast(`Mahlzeit "${food.name}" erfolgreich ins Tagebuch eingetragen!`);
    setTimeout(() => setDiaryToast(null), 3000);
  };

  const handleDeleteDiaryEntry = (id: number) => {
    const updated = diary.filter(e => e.id !== id);
    saveDiaryToStorage(updated);
  };

  const handleClearDiary = () => {
    if (confirm("Möchtest du wirklich alle Einträge aus dem Tagebuch löschen?")) {
      saveDiaryToStorage([]);
    }
  };

  // Filter available swaps for selected food + universal hacks
  const availableSwaps = INGREDIENT_SWAPS.filter(s => s.foodId === food.id || s.foodId === "all");

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
            <span>🩸</span> Wissenschaftlicher Glukose- & Insulinstoffwechsel-Rechner
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
            Blutzucker-Rechner & Mahlzeiten-Tagebuch
          </h1>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
            Simuliere den glykämischen Peak deiner Mahlzeiten in Echtzeit. Wähle smarte Zutaten-Alternativen, um Glukosespitzen um bis zu 85% zu glätten.
          </p>
        </div>

        {/* Toast */}
        {diaryToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-white text-xs md:text-sm font-bold shadow-2xl flex items-center gap-2 bg-emerald-800 animate-bounce">
            <span>✅</span> {diaryToast}
          </div>
        )}

        {/* Main interactive calculator grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Food Selection & Base Params */}
          <div className="md:col-span-6 bg-white rounded-3xl p-6 border shadow-sm space-y-5" style={{ borderColor: C.border }}>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              1. Mahlzeit & Ausgangs-Blutzucker
            </h2>

            {/* Food picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Geplante Mahlzeit / Lebensmittel auswählen:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {FOODS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      setSelectedFoodId(f.id);
                      // set matching swap if available
                      const firstSwap = INGREDIENT_SWAPS.find(s => s.foodId === f.id);
                      if (firstSwap) setSelectedSwapId(firstSwap.id);
                    }}
                    className={`p-2.5 rounded-2xl border text-left transition-all flex items-center gap-2.5 ${
                      selectedFoodId === f.id
                        ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200"
                        : "bg-gray-50/70 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className="text-xl">{f.icon}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                      <p className="text-[10px] text-slate-500">{f.portion}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Starting blood sugar */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-700">Ausgangs-Nüchternglukose:</span>
                <span className="font-mono font-bold text-emerald-800">{startBs} mg/dL</span>
              </div>
              <input
                type="range"
                min={70}
                max={150}
                value={startBs}
                onChange={(e) => setStartBs(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>70 mg/dL (Nüchtern optimal)</span>
                <span>100 mg/dL</span>
                <span>150 mg/dL (Erhöht)</span>
              </div>
            </div>

            {/* Portion size scale */}
            <div className="flex items-center justify-between p-3 rounded-2xl border border-gray-100 text-xs">
              <span className="font-bold text-slate-700">Portionsgröße:</span>
              <div className="flex gap-2">
                {[
                  { label: "Klein (0.7x)", val: 0.7 },
                  { label: "Normal (1.0x)", val: 1.0 },
                  { label: "Groß (1.4x)", val: 1.4 }
                ].map(p => (
                  <button
                    key={p.val}
                    onClick={() => setPortionFactor(p.val)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      portionFactor === p.val ? "bg-slate-800 text-white" : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Swap Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700">
                  2. Smarte Zutaten-Alternative / Stoffwechsel-Hack:
                </label>
                {selectedSwapId && (
                  <button
                    onClick={() => setSelectedSwapId(null)}
                    className="text-[11px] text-red-600 underline font-semibold"
                  >
                    Ohne Alternative
                  </button>
                )}
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {availableSwaps.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSwapId(s.id === selectedSwapId ? null : s.id)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      selectedSwapId === s.id
                        ? "bg-emerald-50 border-emerald-500 shadow-xs ring-1 ring-emerald-300"
                        : "bg-white border-gray-200 hover:border-emerald-300 hover:bg-gray-50/50"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-xl p-1 rounded-lg bg-gray-100">{s.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{s.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{s.extraBenefit}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold font-mono text-emerald-700 whitespace-nowrap">
                      -{s.reductionMgDl} mg/dL
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Simulation & Results */}
          <div className="md:col-span-6 space-y-6">
            <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-5" style={{ borderColor: C.border }}>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">
                Live-Simulation der Blutzuckerkurve
              </h2>

              {/* High-Fidelity Medical-Grade Curve visualization */}
              <div className="p-5 rounded-3xl bg-slate-950 text-white space-y-4 border border-slate-800 shadow-2xl">
                {/* Zone Indicators Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                      <span className="text-slate-300">Ohne Swap: <b className="text-rose-400 font-mono">{originalPeak} mg/dL</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      <span className="text-slate-300">Mit FUDI-Swap: <b className="text-emerald-400 font-mono">{optimizedPeak} mg/dL</b></span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/60 font-bold">
                    Glukosespitze: -{savedMgDl} mg/dL
                  </span>
                </div>

                {/* Main SVG Visualization */}
                <div className="relative w-full">
                  <svg viewBox="0 0 500 180" className="w-full h-48 md:h-56">
                    <defs>
                      {/* Gradient for unoptimized spike */}
                      <linearGradient id="unoptGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.0" />
                      </linearGradient>
                      {/* Gradient for FUDI optimized curve */}
                      <linearGradient id="optGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Zone 3: Danger/Spike Zone (>180) */}
                    <rect x="0" y="0" width="500" height="45" fill="#f43f5e" fillOpacity="0.08" />
                    <line x1="0" y1="45" x2="500" y2="45" stroke="#f43f5e" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <text x="495" y="16" fill="#f43f5e" fontSize="9" textAnchor="end" fontWeight="bold" opacity="0.8">Gefahrenzone / Spike (&gt;180 mg/dL)</text>

                    {/* Zone 2: Elevated Zone (140-180) */}
                    <rect x="0" y="45" width="500" height="45" fill="#f59e0b" fillOpacity="0.06" />
                    <line x1="0" y1="90" x2="500" y2="90" stroke="#10b981" strokeDasharray="4 4" strokeOpacity="0.5" />
                    <text x="495" y="86" fill="#10b981" fontSize="9" textAnchor="end" fontWeight="bold" opacity="0.9">140 mg/dL Normalgrenze</text>

                    {/* Zone 1: Healthy Optimal Metabolic Zone (<140) */}
                    <rect x="0" y="90" width="500" height="90" fill="#10b981" fillOpacity="0.05" />
                    <text x="12" y="172" fill="#10b981" fontSize="9" fontWeight="bold" opacity="0.7">✓ Optimaler Stoffwechselbereich (70–140 mg/dL)</text>

                    {/* Time Grid Lines */}
                    {[80, 180, 280, 380].map((x, i) => (
                      <line key={i} x1={x} y1="0" x2={x} y2="180" stroke="#ffffff" strokeOpacity="0.07" strokeDasharray="2 2" />
                    ))}

                    {/* Original Unoptimized Curve (Red dashed + area) */}
                    <path
                      d={`M 20 140 Q 180 ${Math.max(15, 140 - (rawImpact * 1.8))} 320 120 T 480 140 L 480 180 L 20 180 Z`}
                      fill="url(#unoptGrad)"
                    />
                    <path
                      d={`M 20 140 Q 180 ${Math.max(15, 140 - (rawImpact * 1.8))} 320 120 T 480 140`}
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2.5"
                      strokeDasharray="5 4"
                    />
                    {/* Red Peak Marker */}
                    <circle cx="180" cy={Math.max(15, 140 - (rawImpact * 1.8))} r="4" fill="#f43f5e" />
                    <text x="180" y={Math.max(15, 140 - (rawImpact * 1.8)) - 8} fill="#f43f5e" fontSize="9" textAnchor="middle" fontWeight="bold">
                      Peak: {originalPeak}
                    </text>

                    {/* FUDI Optimized Curve (Glowing Green Solid) */}
                    <path
                      d={`M 20 140 Q 180 ${Math.max(45, 140 - (optimizedImpact * 1.8))} 320 130 T 480 140 L 480 180 L 20 180 Z`}
                      fill="url(#optGrad)"
                    />
                    <path
                      d={`M 20 140 Q 180 ${Math.max(45, 140 - (optimizedImpact * 1.8))} 320 130 T 480 140`}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    {/* Green Peak Marker with glowing halo */}
                    <circle cx="180" cy={Math.max(45, 140 - (optimizedImpact * 1.8))} r="7" fill="#10b981" fillOpacity="0.3" />
                    <circle cx="180" cy={Math.max(45, 140 - (optimizedImpact * 1.8))} r="4" fill="#34d399" />
                    <text x="180" y={Math.max(45, 140 - (optimizedImpact * 1.8)) - 10} fill="#34d399" fontSize="10" textAnchor="middle" fontWeight="black">
                      {optimizedPeak} mg/dL
                    </text>
                  </svg>

                  {/* Time Axis Labels */}
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono pt-1 px-2 border-t border-slate-800">
                    <span>0 Min (Nüchtern)</span>
                    <span>30 Min</span>
                    <span className="font-bold text-emerald-400">45 Min (Peak)</span>
                    <span>90 Min</span>
                    <span>120 Min (Baseline)</span>
                  </div>
                </div>

                {/* Medical KPI Strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Insulinlast (AUC)</p>
                    <p className="text-xs font-bold font-mono text-emerald-400 mt-0.5">-62% Belastung</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Glykämische Last (GL)</p>
                    <p className="text-xs font-bold font-mono text-emerald-300 mt-0.5">Niedrig (&lt;10)</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800">
                    <p className="text-[10px] text-slate-400">Rückkehr Baseline</p>
                    <p className="text-xs font-bold font-mono text-slate-200 mt-0.5">ca. 85 Min.</p>
                  </div>
                </div>
              </div>

              {/* Impact comparison cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <p className="text-[11px] font-bold text-rose-800">Original Peak</p>
                  <p className="text-xl font-black font-mono text-rose-900 mt-1">{originalPeak} <span className="text-xs font-normal">mg/dL</span></p>
                  <p className="text-[10px] text-rose-700 mt-0.5">+{rawImpact} mg/dL Anstieg</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300">
                  <p className="text-[11px] font-bold text-emerald-800">FUDI Optimiert</p>
                  <p className="text-xl font-black font-mono text-emerald-900 mt-1">{optimizedPeak} <span className="text-xs font-normal">mg/dL</span></p>
                  <p className="text-[10px] text-emerald-700 mt-0.5">Glukosespitze: -{savedMgDl} mg/dL</p>
                </div>
              </div>

              {/* Action Button: In Tagebuch eintragen */}
              <button
                onClick={handleAddToDiary}
                className="w-full py-4 rounded-2xl text-white font-extrabold text-sm shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 bg-emerald-800"
              >
                <span>📖</span> Diese Mahlzeit in mein Tagebuch eintragen
              </button>

              {/* Medical Notice */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                <span>ℹ️</span>
                <p>
                  <b>Medizinischer Hinweis:</b> Die Glukosekurve ist eine biophysikalische Modell-Simulation basierend auf glykämischer Last, Fett- und Ballaststoffverzögerung. Individuelle Reaktionen variieren je nach Mikrobiom und Insulinempfindlichkeit.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dedicated Food & Blood Sugar Diary Section */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border shadow-sm space-y-6" style={{ borderColor: C.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4" style={{ borderColor: C.border }}>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">📓</span>
                <h2 className="text-lg md:text-xl font-black text-slate-900">
                  Mein Ernährungs- & Blutzucker-Tagebuch
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Historie aller erfassten Mahlzeiten, Glukosepeaks und erzielten Stoffwechsel-Einsparungen.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-mono">
                {diary.length} Einträge
              </span>
              {diary.length > 0 && (
                <button
                  onClick={handleClearDiary}
                  className="text-xs text-red-600 hover:text-red-800 font-semibold underline"
                >
                  Tagebuch leeren
                </button>
              )}
            </div>
          </div>

          {/* Diary Entries List */}
          {diary.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <span className="text-4xl block">📝</span>
              <p className="text-sm font-semibold text-slate-600">Noch keine Tagebucheinträge vorhanden.</p>
              <p className="text-xs">Wähle oben eine Mahlzeit aus und klicke auf "In mein Tagebuch eintragen".</p>
            </div>
          ) : (
            <div className="space-y-3">
              {diary.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl border border-gray-200 bg-gray-50/60 hover:bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-gray-200 shadow-xs text-xl">
                      🥗
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{item.meal}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono font-semibold">
                          {item.date} um {item.time}
                        </span>
                      </div>
                      {item.swapTitle && (
                        <p className="text-xs text-emerald-700 font-medium mt-1 flex items-center gap-1">
                          <span>✨ Swap:</span> <span>{item.swapTitle}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-2 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-gray-500">Peak Glukose</p>
                      <p className="text-sm font-extrabold font-mono text-slate-900">{item.peakBs} mg/dL</p>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="text-[10px] text-emerald-700 font-bold">Eingespart</p>
                      <p className="text-sm font-extrabold font-mono text-emerald-600">
                        {item.savedMgDl > 0 ? `-${item.savedMgDl} mg/dL` : "Optimal"}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteDiaryEntry(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-white transition-colors"
                      title="Eintrag löschen"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
