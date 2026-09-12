import { useState } from "react";
import { C } from "../shared/colors";

const WORKOUTS = [
  {
    id: 1,
    name: "Push Hypertrophie (Brust / Schulter / Trizeps)",
    icon: "🏋️",
    sets: 16,
    reps: 10,
    rest: 90,
    kcal: 420,
    duration: 55,
    category: "Kraft",
    muscles: "Brust, Vordere Schulter, Trizeps",
    steps: [
      "Warm-up: 5 Min. Schulter-Rotatorenmanschette mit Theraband & Liegestütze",
      "Schrägbankdrücken mit Kurzhanteln: 4 Sätze x 8–10 Wdh. (RPE 8, 90s Pause)",
      "Klassisches Flachbankdrücken Langhantel: 3 Sätze x 8 Wdh.",
      "Seitheben am Kabelzug oder KH: 4 Sätze x 12–15 Wdh. für runde Schultern",
      "Dips am Holm (körpergewicht/zusatzgewicht): 3 Sätze bis Muskelversagen",
      "Trizeps-Drücken am Seilzug: 3 Sätze x 12 Wdh. mit 2s Peak-Kontraktion"
    ]
  },
  {
    id: 2,
    name: "Pull Fokus (Rückenbreite / Bizeps / Hintere Schulter)",
    icon: "⚡",
    sets: 15,
    reps: 10,
    rest: 90,
    kcal: 390,
    duration: 50,
    category: "Kraft",
    muscles: "Latissimus, Rhomboiden, Bizeps",
    steps: [
      "Warm-up: 5 Min. Ruder-Ergometer & Scapula Pull-ups",
      "Klimmzüge im Obergriff (Pronation): 4 Sätze x 6–8 Wdh.",
      "Vorgebeugtes Langhantelrudern: 4 Sätze x 8–10 Wdh.",
      "Latzug zur Brust im engen Parallelgriff: 3 Sätze x 10–12 Wdh.",
      "Facepulls mit Seil (Hintere Schulter & Haltung): 3 Sätze x 15 Wdh.",
      "Incline Dumbbell Biceps Curls: 3 Sätze x 10–12 Wdh."
    ]
  },
  {
    id: 3,
    name: "Leg Day (Quadrizeps, Beinbeuger, Waden)",
    icon: "🦵",
    sets: 16,
    reps: 12,
    rest: 120,
    kcal: 520,
    duration: 60,
    category: "Kraft",
    muscles: "Quadrizeps, Ischios, Gluteus, Waden",
    steps: [
      "Warm-up: Hüftmobilisation 90/90, Glute Bridges & Kniebeugen mit Körpergewicht",
      "Barbell Back Squats (Kniebeuge tief): 4 Sätze x 6–8 Wdh.",
      "Rumänisches Kreuzheben (RDL) für Beinbeuger: 3 Sätze x 10 Wdh.",
      "Ausfallschritte (Walking Lunges) mit KH: 3 Sätze x 12 Schritte pro Bein",
      "Beinstrecker an der Maschine im Supersatz mit Beinbeuger: 3 Sätze x 12 Wdh.",
      "Stehendes Wadenheben: 4 Sätze x 15 Wdh. mit 2 Sek. Dehnung am Tiefpunkt"
    ]
  },
  {
    id: 4,
    name: "Ganzkörper Grundlagen-Kraft A",
    icon: "💪",
    sets: 15,
    reps: 8,
    rest: 90,
    kcal: 450,
    duration: 50,
    category: "Kraft",
    muscles: "Gesamter Körper",
    steps: [
      "Warm-up: 5 Min. dynamische Mobilisation & Foam Rolling",
      "Front-Kniebeuge oder Goblet Squat: 4 Sätze x 8 Wdh.",
      "Flachbankdrücken mit Kurzhanteln: 3 Sätze x 8–10 Wdh.",
      "Langhantel-Rudern vorgebeugt: 4 Sätze x 8 Wdh.",
      "Pfeiler-Plank mit Schulter-Taps: 3 Sätze x 45 Sekunden",
      "Cool-down & Pectoralis-Dehnung"
    ]
  },
  {
    id: 5,
    name: "HIIT Tabata Fatburn (Home No-Equipment)",
    icon: "🔥",
    sets: 8,
    reps: 20,
    rest: 20,
    kcal: 360,
    duration: 25,
    category: "Kraft",
    muscles: "Ganzkörper & Herz-Kreislauf",
    steps: [
      "Warm-up: 3 Min. Jumping Jacks, Armkreisen und lockere High Knees",
      "Intervall 1: Burpees (40 Sek. Vollgas, 20 Sek. Pause)",
      "Intervall 2: Mountain Climbers im schnellen Wechsel",
      "Intervall 3: Squat Jumps (Explosiv nach oben)",
      "Intervall 4: Liegestütze mit Tempo (2 Sek. ab, 1 Sek. hoch)",
      "Wiederhole diesen 4er-Zirkel für 4 Durchgänge (Gesamt: 16 Intervalle)",
      "Cool-down: 4 Min. Puls beruhigen & Atemsynchronisation"
    ]
  },
  {
    id: 6,
    name: "Zone-2 Fettstoffwechsel & Herzkreislauf",
    icon: "🏃",
    sets: 1,
    reps: 1,
    rest: 0,
    kcal: 410,
    duration: 45,
    category: "Ausdauer",
    muscles: "Beinmuskulatur, Myokard, Mitochondrien",
    steps: [
      "Vorbereitung: Puls-Uhr oder Brustgurt anlegen (Ziel: 65–75% HFmax / Sprechtempo)",
      "Einlaufen: 5 Minuten lockeres Traben oder moderates Radeln",
      "Hauptblock: 35 Minuten konstantes Tempo im aeroben Schwellenbereich",
      "Auslaufen: 5 Minuten langsames Gehen",
      "Unterstützt die zelluläre Fettverbrennung ohne Erschöpfung des Nervensystems"
    ]
  },
  {
    id: 7,
    name: "Rücken- & Wirbelsäulen-Prävention",
    icon: "🧘",
    sets: 4,
    reps: 12,
    rest: 30,
    kcal: 140,
    duration: 30,
    category: "Mobilitaet",
    muscles: "Autochthone Rückenmuskeln, Core, Nacken",
    steps: [
      "Katze-Kuh im Vierfüßlerstand: 12 sanfte Atemzyklen zur Bandscheibenschmierung",
      "Bird-Dog (diagonales Strecken): 3 Sätze x 10 Wdh. pro Seite mit 3 Sek. Halten",
      "Side Plank mit Hüftheben: 3 Sätze x 30 Sek. pro Seite",
      "Cobra & Herabschauender Hund im Wechsel: 8 Wiederholungen",
      "Glute-Bridge einbeinig: 3 Sätze x 12 Wdh. zur Aktivierung des Gesäßes gegen Sitzen"
    ]
  },
  {
    id: 8,
    name: "Kompaktes 15-Min Morgen-Mobility",
    icon: "☀️",
    sets: 1,
    reps: 1,
    rest: 0,
    kcal: 90,
    duration: 15,
    category: "Mobilitaet",
    muscles: "Hüfte, Brustwirbelsäule, Sprunggelenk",
    steps: [
      "World's Greatest Stretch: 5 tiefe Wdh. pro Seite",
      "Deep Asian Squat (tiefe Hocke halten): 2 Minuten mit aufrechtem Brustkorb",
      "Schulter-Dislocations mit Handtuch oder Besenstiel: 15 sanfte Durchzüge",
      "Taube (Pigeon Pose) für Piriformis und Hüftöffner: je 60 Sek. halten"
    ]
  }
];

const WEEK_WORKOUTS = [
  { day: "Mo", done: true, type: "Push", kcal: 420 },
  { day: "Di", done: true, type: "Ausdauer", kcal: 410 },
  { day: "Mi", done: false, type: "Ruhe / Mobility", kcal: 90 },
  { day: "Do", done: true, type: "Pull", kcal: 390 },
  { day: "Fr", done: true, type: "Legs", kcal: 520 },
  { day: "Sa", done: false, type: "Geplant HIIT", kcal: 360 },
  { day: "So", done: false, type: "Ruhe", kcal: 0 },
];

const NUTRITION_TIPS = [
  { emoji: "💧", tip: "Trinke 30–45 Min. vor dem Krafttraining 500ml Wasser mit einer Prise Meersalz für optimalen Muskel-Zellpump.", type: "Hydration" },
  { emoji: "🍌", tip: "Pre-Workout Glukose: 60–90 Min. vor harten Einheiten 30–40g komplexe Carbs (z.B. Haferflocken oder Banane mit Zimt).", type: "Pre-Workout" },
  { emoji: "🥩", tip: "Anaboles Zeitfenster: Innerhalb von 90 Min. nach Trainingsende 35–45g biologisch hochwertiges Protein (Leucin > 3g).", type: "Post-Workout" },
  { emoji: "🥑", tip: "Hormonhaushalt: Mindestens 0,8g Fett pro kg Körpergewicht täglich für stabilen Testosteron- und Regenerationsspiegel.", type: "Regeneration" },
];

const CATS = ["Alle", "Kraft", "Ausdauer", "Mobilitaet"];
const CAT_COLORS: Record<string, string> = {
  "Kraft": "#dc2626",
  "Ausdauer": "#2563eb",
  "Mobilitaet": "#16a34a",
};

export default function FitnessTracker() {
  const [selectedCat, setSelectedCat] = useState("Alle");
  const [activeWorkout, setActiveWorkout] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [loggedWorkouts, setLoggedWorkouts] = useState<number[]>([1, 2, 4]);

  const filtered = selectedCat === "Alle" ? WORKOUTS : WORKOUTS.filter(w => w.category === selectedCat);
  const totalKcalBurned = loggedWorkouts.reduce((sum, id) => {
    const w = WORKOUTS.find(w => w.id === id);
    return sum + (w?.kcal || 0);
  }, 0);
  const totalMinutes = loggedWorkouts.reduce((sum, id) => {
    const w = WORKOUTS.find(w => w.id === id);
    return sum + (w?.duration || 0);
  }, 0);

  const toggleLog = (id: number) => {
    setLoggedWorkouts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const startTimer = (workoutId: number) => {
    setActiveWorkout(workoutId);
    setTimer(0);
    setTimerRunning(true);
    const interval = setInterval(() => {
      setTimer(t => t + 1);
    }, 1000);
    setTimeout(() => clearInterval(interval), 3600000);
  };

  const formatTimer = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-black" style={{ fontFamily: "'DM Sans',sans-serif", color: C.forest, letterSpacing: "-0.03em" }}>
          Fitness & Trainingssteuerung ⚡
        </h1>
        <p className="text-sm mt-1" style={{ color: C.stone }}>
          Wissenschaftlich fundierte Split-Varianten, Satz-Schemata & Erholungs-Timing
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Einheiten diese Woche", value: loggedWorkouts.length.toString(), unit: "/ 5 Ziel", icon: "🏆", color: C.forest },
          { label: "Kalorien verbraucht", value: totalKcalBurned.toString(), unit: "kcal", icon: "🔥", color: C.coral },
          { label: "Trainingszeit", value: totalMinutes.toString(), unit: "min", icon: "⏱", color: C.mint },
          { label: "Regenerations-Score", value: "94", unit: "/ 100", icon: "🔋", color: "#7c3aed" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border shadow-sm" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{s.icon}</span>
              <span className="text-xs font-medium" style={{ color: C.stone }}>{s.label}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-black" style={{ fontFamily: "'JetBrains Mono',monospace", color: s.color }}>{s.value}</span>
              <span className="text-xs mb-1" style={{ color: C.stone }}>{s.unit}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Workout List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Weekly Overview */}
          <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3" style={{ color: C.forest }}>Wochenplan & Frequenz</h3>
            <div className="grid grid-cols-7 gap-1.5">
              {WEEK_WORKOUTS.map((w) => (
                <div key={w.day} className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded-xl">
                  <span className="text-[10px] font-bold" style={{ color: C.stone }}>{w.day}</span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white"
                    style={{ background: w.done ? C.mint : (w.kcal > 0 ? C.coral : C.border) }}>
                    {w.done ? "✓" : (w.kcal > 0 ? "⚡" : "Z")}
                  </div>
                  <span className="text-[9px] font-semibold text-center truncate w-full text-gray-600">{w.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border"
                style={{
                  background: selectedCat === cat ? C.forest : "white",
                  color: selectedCat === cat ? "white" : C.stone,
                  borderColor: selectedCat === cat ? C.forest : C.border,
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="space-y-3">
            {filtered.map(w => {
              const isLogged = loggedWorkouts.includes(w.id);
              const isTimerTarget = activeWorkout === w.id;
              return (
                <div key={w.id} className="bg-white rounded-2xl border p-4 transition-all hover:shadow-md" style={{ borderColor: C.border }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl p-2 rounded-xl bg-gray-50">{w.icon}</span>
                      <div>
                        <h4 className="font-bold text-sm" style={{ color: C.forest }}>{w.name}</h4>
                        <span className="text-[11px]" style={{ color: C.stone }}>Fokus: {w.muscles}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ background: CAT_COLORS[w.category] || C.mint }}>
                      {w.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs py-2 my-2 border-y border-gray-100" style={{ color: C.stone }}>
                    <span>⏱ {w.duration} Min.</span>
                    <span>🔥 {w.kcal} kcal</span>
                    <span>📊 {w.sets} Sätze / {w.reps} Wdh.</span>
                    <span>⏳ {w.rest}s Pause</span>
                  </div>

                  {/* Exercise steps */}
                  <div className="space-y-1 mb-3 bg-gray-50 p-2.5 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Übungs-Ablauf:</span>
                    {w.steps.map((st, i) => (
                      <div key={i} className="text-[11px] text-gray-700 flex items-start gap-1.5">
                        <span className="text-gray-400 font-bold">•</span>
                        <span>{st}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-1">
                    <button
                      onClick={() => toggleLog(w.id)}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold transition-all"
                      style={{
                        background: isLogged ? "#dcfce7" : "#f1f5f9",
                        color: isLogged ? "#166534" : "#475569"
                      }}
                    >
                      {isLogged ? "✓ Als absolviert markiert" : "+ Als erledigt eintragen"}
                    </button>

                    <button
                      onClick={() => startTimer(w.id)}
                      className="text-xs px-3 py-1.5 rounded-xl font-bold text-white transition-all hover:opacity-90"
                      style={{ background: isTimerTarget && timerRunning ? C.coral : C.forest }}
                    >
                      {isTimerTarget && timerRunning ? `Satz-Timer: ${formatTimer(timer)}` : "▶ Training starten"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Nutrition & Pre/Post Workout Fuel */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border p-4 shadow-sm" style={{ borderColor: C.border }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: C.forest }}>
              <span>🥑</span> Hermes Ernährungs-Guidelines
            </h3>
            <div className="space-y-3">
              {NUTRITION_TIPS.map((tip, i) => (
                <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center gap-1.5 text-xs font-bold mb-1" style={{ color: C.forest }}>
                    <span>{tip.emoji}</span>
                    <span>{tip.type}</span>
                  </div>
                  <p className="text-[11px] text-gray-600 leading-relaxed">{tip.tip}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4">
            <h4 className="text-xs font-black text-emerald-900 mb-1">💡 Supermarkt-Synergie</h4>
            <p className="text-[11px] text-emerald-800 leading-relaxed mb-3">
              Kopple dein Krafttraining direkt mit den aktuellen High-Protein Angeboten im Supermarkt (Magerquark 0,99€, Bio-Eier, Lachsfilet).
            </p>
            <a href="/einkaufsliste" className="text-xs font-bold text-emerald-700 underline block">
              → Zu aktuellen Angeboten der Woche
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}