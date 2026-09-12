import { useState, useEffect, useRef } from "react";
import { C } from "../shared/colors";

export interface ExerciseStep {
  name: string;
  durationOrReps: string;
  musclesTrained: string;
  techniqueTip: string;
}

export interface WorkoutItem {
  id: number;
  name: string;
  icon: string;
  category: "Kraft" | "Ausdauer" | "Mobilitaet" | "Yoga" | "TaiChi";
  muscles: string;
  targetedMuscleGroups: string[];
  duration: number; // min
  kcal: number;
  difficulty: "Anfänger" | "Mittel" | "Fortgeschritten";
  steps: ExerciseStep[];
}

const WORKOUTS: WorkoutItem[] = [
  // 1. Kraft Push
  {
    id: 1,
    name: "Push Hypertrophie (Brust / Schulter / Trizeps)",
    icon: "🏋️",
    category: "Kraft",
    difficulty: "Mittel",
    duration: 50,
    kcal: 420,
    muscles: "Pectoralis Major, Deltoideus anterior, Triceps brachii",
    targetedMuscleGroups: ["Brust & Trizeps", "Schulter & Nacken"],
    steps: [
      { name: "Warm-up: Schulter-Rotatorenmanschette", durationOrReps: "5 Min.", musclesTrained: "Infraspinatus, Supraspinatus", techniqueTip: "Mit leichtem Theraband kontrolliert nach außen rotieren." },
      { name: "Schrägbankdrücken mit Kurzhanteln", durationOrReps: "4 Sätze x 8–10 Wdh.", musclesTrained: "Clavicularer Anteil Pectoralis Major", techniqueTip: "30-Grad-Winkel, Ellbogen leicht nach innen führen." },
      { name: "Flachbankdrücken Langhantel", durationOrReps: "3 Sätze x 8 Wdh.", musclesTrained: "Pectoralis Major, Triceps brachii", techniqueTip: "Schulterblätter fest auf die Bank ziehen (Retraktion)." },
      { name: "Seitheben am Kabelzug", durationOrReps: "4 Sätze x 12–15 Wdh.", musclesTrained: "Deltoideus lateralis", techniqueTip: "Kleine Finger leicht anheben für maximalen seitlichen Schulterfokus." },
      { name: "Dips am Barren", durationOrReps: "3 Sätze bis Muskelversagen", musclesTrained: "Unterer Pectoralis, Trizeps", techniqueTip: "Leichte Vorneigung des Oberkörpers schont das Schultergelenk." },
    ]
  },
  // 2. Kraft Pull
  {
    id: 2,
    name: "Pull Fokus (Rückenbreite / Bizeps / Nacken)",
    icon: "⚡",
    category: "Kraft",
    difficulty: "Fortgeschritten",
    duration: 50,
    kcal: 390,
    muscles: "Latissimus dorsi, Rhomboidei, Biceps brachii, Trapezius",
    targetedMuscleGroups: ["Rücken & Bizeps", "Schulter & Nacken"],
    steps: [
      { name: "Klimmzüge im Obergriff (Pronation)", durationOrReps: "4 Sätze x 6–8 Wdh.", musclesTrained: "Latissimus dorsi, Teres major", techniqueTip: "Aus dem toten Hängen starten, Brust aktiv zur Stange ziehen." },
      { name: "Vorgebeugtes Langhantelrudern", durationOrReps: "4 Sätze x 8–10 Wdh.", musclesTrained: "Rhomboidei, Latissimus, Erector spinae", techniqueTip: "Rücken im 45°-Winkel gerade halten, Stange zum Bauchnabel ziehen." },
      { name: "Facepulls am Seilzug", durationOrReps: "3 Sätze x 15 Wdh.", musclesTrained: "Deltoideus posterior, Infraspinatus", techniqueTip: "Seil zu den Augenbrauen ziehen, Schultern nach hinten drehen." },
      { name: "Incline Biceps Curls", durationOrReps: "3 Sätze x 10–12 Wdh.", musclesTrained: "Biceps brachii (langer Kopf)", techniqueTip: "Volle Dehnung am Tiefpunkt spüren, kein Schwung aus den Schultern." },
    ]
  },
  // 3. Kraft Legs
  {
    id: 3,
    name: "Leg Day (Quadrizeps, Ischios & Gluteus)",
    icon: "🦵",
    category: "Kraft",
    difficulty: "Fortgeschritten",
    duration: 60,
    kcal: 510,
    muscles: "Quadriceps femoris, Gluteus maximus, Ischiocrurale Muskeln",
    targetedMuscleGroups: ["Beine & Gluteus"],
    steps: [
      { name: "Kniebeugen mit Langhantel (Back Squats)", durationOrReps: "4 Sätze x 6–8 Wdh.", musclesTrained: "Quadriceps, Gluteus maximus", techniqueTip: "Fersen fest in den Boden drücken, Knie in Fußspitzenrichtung führen." },
      { name: "Rumänisches Kreuzheben (RDL)", durationOrReps: "3 Sätze x 10 Wdh.", musclesTrained: "Biceps femoris, Semitendinosus", techniqueTip: "Hüfte nach hinten schieben, Knie nur minimal beugen (Hinge)." },
      { name: "Bulgarische Ausfallschritte (Split Squats)", durationOrReps: "3 Sätze x 10 Wdh./Bein", musclesTrained: "Gluteus medius, Quadriceps", techniqueTip: "Oberkörper leicht nach vorn neigen für Gluteus-Fokus." },
      { name: "Wadenheben stehend", durationOrReps: "4 Sätze x 15 Wdh.", musclesTrained: "Gastrocnemius, Soleus", techniqueTip: "2 Sekunden Dehnung am Tiefpunkt halten." },
    ]
  },
  // 4. Yoga Asana Flow
  {
    id: 4,
    name: "Vinyasa Yoga & Asana Balance Flow",
    icon: "🧘‍♀️",
    category: "Yoga",
    difficulty: "Mittel",
    duration: 40,
    kcal: 220,
    muscles: "Transversus abdominis, Erector spinae, Psoas major, Gluteus medius",
    targetedMuscleGroups: ["Core & Rücken", "Beine & Gluteus"],
    steps: [
      { name: "Herabschauender Hund (Adho Mukha Svanasana)", durationOrReps: "5 tiefe Atemzüge", musclesTrained: "Ischiocrurale Muskeln, Schulterblatt-Stabilisatoren", techniqueTip: "Fersen Richtung Boden schieben, Rücken lang machen, Steißbein zum Himmel." },
      { name: "Krieger I & II (Virabhadrasana I/II)", durationOrReps: "Je 45 Sek. pro Seite", musclesTrained: "Quadrizeps, Psoas major, Gesäßmuskeln", techniqueTip: "Vorderes Knie über dem Sprunggelenk fixieren, Becken parallel ausrichten." },
      { name: "Kobra (Bhujangasana)", durationOrReps: "3 Wiederholungen", musclesTrained: "Erector spinae, Pectoralis minor", techniqueTip: "Brustbein heben ohne Druck auf die Lendenwirbelsäule auszuüben." },
      { name: "Die Taube (Kapotasana Hüftöffner)", durationOrReps: "Je 60 Sek. pro Seite", musclesTrained: "Piriformis, Hüftbeuger", techniqueTip: "Spannung mit jedem Ausatmen lösen, Becken gerade halten." },
      { name: "Der Baum (Vrikshasana Balance)", durationOrReps: "Je 45 Sek. pro Seite", musclesTrained: "Fußgewölbe, Peroneus, Abduktoren, Tiefenmuskeln", techniqueTip: "Blick auf einen festen Punkt richten, Fuß an Wade oder Oberschenkel." },
    ]
  },
  // 5. Tai Chi & Qi Gong
  {
    id: 5,
    name: "Tai Chi 24er Peking-Form & Qi-Gong Fluss",
    icon: "☯️",
    category: "TaiChi",
    difficulty: "Anfänger",
    duration: 35,
    kcal: 160,
    muscles: "Soleus, Vastus medialis, Core Tiefenstabilisatoren, Nacken",
    targetedMuscleGroups: ["Core & Rücken", "Beine & Gluteus", "Schulter & Nacken"],
    steps: [
      { name: "Eröffnung des Tai Chi (Qi Shi)", durationOrReps: "3 Zyklen", musclesTrained: "Schultergürtel, Zwerchfell", techniqueTip: "Arme wie schwebend heben, Knie sanft beugen, Atem mit Bewegung synchronisieren." },
      { name: "Die Mähne des Wildpferdes teilen (Ye Ma Fen Zong)", durationOrReps: "4 Schritte links/rechts", musclesTrained: "Rotatoren, Quadriceps, Hüftrotatoren", techniqueTip: "Gewicht fließend auf das hintere Bein verlagern, Armbogen weit halten." },
      { name: "Der weiße Kranich breitet seine Flügel aus", durationOrReps: "3 Wiederholungen", musclesTrained: "Gleichgewichtssinn, Fußgelenksstabilisatoren", techniqueTip: "Standbein fest verwurzeln, Fingerkuppen leicht und entspannt führen." },
      { name: "Wolkenhände (Yun Shou)", durationOrReps: "5 Wiederholungen beidseitig", musclesTrained: "Obliquus internus/externus, Schultern", techniqueTip: "Hüfte führt die Arme, Blick folgt der oberen Handfläche." },
      { name: "Den Tiger umarmen & zum Berg zurückkehren", durationOrReps: "3 Min. Abschluss", musclesTrained: "Gesamter Körper, Parasympathikus", techniqueTip: "Tiefe Bauchatmung zur Senkung von Cortisol und Puls." },
    ]
  },
  // 6. HIIT & Ausdauer
  {
    id: 6,
    name: "HIIT Tabata Fatburn & Mitochondrien-Boost",
    icon: "🔥",
    category: "Ausdauer",
    difficulty: "Fortgeschritten",
    duration: 25,
    kcal: 360,
    muscles: "Gesamtkörper, Myokard, Typ-II Muskelfasern",
    targetedMuscleGroups: ["Beine & Gluteus", "Core & Rücken"],
    steps: [
      { name: "Burpees mit Hochstrecksprung", durationOrReps: "40s Belastung / 20s Pause", musclesTrained: "Ganzkörper & Herzkreislauf", techniqueTip: "Brust bis zum Boden, explosive Landung auf dem ganzen Fuß." },
      { name: "Mountain Climbers Sprint", durationOrReps: "40s Belastung / 20s Pause", musclesTrained: "Rectus abdominis, Schultern", techniqueTip: "Hüfte flach halten, Knie Richtung Ellbogen treiben." },
      { name: "Jump Squats explosiv", durationOrReps: "40s Belastung / 20s Pause", musclesTrained: "Quadrizeps, Waden, Gesäß", techniqueTip: "Weich landen, Hüfte sofort wieder nach hinten absenken." },
    ]
  }
];

const MUSCLE_FILTERS = ["Alle Muskeln", "Brust & Trizeps", "Rücken & Bizeps", "Beine & Gluteus", "Core & Rücken", "Schulter & Nacken"];
const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

export default function FitnessTracker() {
  const [selectedCat, setSelectedCat] = useState<string>("Alle");
  const [selectedMuscle, setSelectedMuscle] = useState<string>("Alle Muskeln");
  const [activeWorkout, setActiveWorkout] = useState<WorkoutItem | null>(null);

  // Variable Week Plan Settings
  const [frequencyDays, setFrequencyDays] = useState<number>(4);
  const [selectedWeekdays, setSelectedWeekdays] = useState<string[]>(["Mo", "Mi", "Fr", "Sa"]);

  // Timer & Voice Control State
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [isListeningVoice, setIsListeningVoice] = useState<boolean>(false);
  const [voiceLog, setVoiceLog] = useState<string>("");
  const timerIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);

  // Logged completed workouts
  const [loggedWorkouts, setLoggedWorkouts] = useState<{ id: number; date: string; kcal: number; title: string }[]>(() => {
    try {
      const saved = localStorage.getItem("fudi_fitness_log");
      if (saved) return JSON.parse(saved);
    } catch(e) { console.error(e); }
    return [
      { id: 1, date: "11.09.2026", kcal: 420, title: "Push Hypertrophie" },
      { id: 4, date: "10.09.2026", kcal: 220, title: "Vinyasa Yoga Flow" },
    ];
  });

  const saveLoggedWorkouts = (list: any[]) => {
    setLoggedWorkouts(list);
    try {
      localStorage.setItem("fudi_fitness_log", JSON.stringify(list));
    } catch(e) { console.error(e); }
  };

  // Timer Tick
  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning]);

  const handleStartTimer = () => setTimerRunning(true);
  const handlePauseTimer = () => setTimerRunning(false);
  
  const handleStopTimer = () => {
    setTimerRunning(false);
    if (activeWorkout) {
      const minutes = Math.max(1, Math.round(timerSeconds / 60));
      const burned = Math.round((activeWorkout.kcal / activeWorkout.duration) * minutes);
      const newEntry = {
        id: Date.now(),
        date: new Date().toLocaleDateString("de-DE"),
        kcal: burned,
        title: `${activeWorkout.name} (${minutes} Min.)`
      };
      saveLoggedWorkouts([newEntry, ...loggedWorkouts]);
      alert(`🎉 Training abgeschlossen! ${minutes} Minuten erfasst (${burned} kcal verbrannt).`);
    }
    setTimerSeconds(0);
  };

  const handleResetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };

  // Voice recognition for Timer
  const toggleVoiceControl = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sprachsteuerung wird in diesem Browser leider nicht unterstützt.");
      return;
    }

    if (isListeningVoice) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListeningVoice(false);
      setVoiceLog("Sprachsteuerung gestoppt.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "de-DE";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const cmd = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
      setVoiceLog(`Befehl: "${cmd}"`);

      if (cmd.includes("start") || cmd.includes("los") || cmd.includes("weiter")) {
        handleStartTimer();
      } else if (cmd.includes("pause") || cmd.includes("warte")) {
        handlePauseTimer();
      } else if (cmd.includes("stopp") || cmd.includes("fertig") || cmd.includes("beenden")) {
        handleStopTimer();
      } else if (cmd.includes("reset") || cmd.includes("zurücksetzen") || cmd.includes("null")) {
        handleResetTimer();
      }
    };

    recognition.onerror = () => setIsListeningVoice(false);
    recognition.onend = () => setIsListeningVoice(false);

    recognition.start();
    recognitionRef.current = recognition;
    setIsListeningVoice(true);
    setVoiceLog('Aktiv! Sag z. B. "Start", "Pause", "Stopp" oder "Reset"');
  };

  // Toggle Weekday
  const toggleWeekday = (day: string) => {
    if (selectedWeekdays.includes(day)) {
      if (selectedWeekdays.length > 1) {
        setSelectedWeekdays(selectedWeekdays.filter(d => d !== day));
      }
    } else {
      setSelectedWeekdays([...selectedWeekdays, day]);
    }
  };

  // Filter Workouts
  const filteredWorkouts = WORKOUTS.filter(w => {
    const matchesCat = selectedCat === "Alle" || w.category === selectedCat;
    const matchesMuscle = selectedMuscle === "Alle Muskeln" || w.targetedMuscleGroups.includes(selectedMuscle);
    return matchesCat && matchesMuscle;
  });

  const totalKcal = loggedWorkouts.reduce((s, w) => s + w.kcal, 0);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: C.sandLight }}>
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 mb-1">
              <span>⚡</span> Wissenschaftliche Trainingssteuerung & Frequenz
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
              Fitness-Tracker & Interaktives Workout
            </h1>
            <p className="text-xs md:text-sm text-slate-600">
              Konfiguriere deine wöchentlichen Trainingstage flexibel. Wähle zwischen Hypertrophie, Yoga-Asanas und Tai Chi mit genauer Muskelgruppen-Anatomie.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl border shadow-xs flex items-center gap-4" style={{ borderColor: C.border }}>
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Verbrannte Energie (Total)</p>
              <p className="text-lg font-black font-mono text-emerald-800">{totalKcal} kcal</p>
            </div>
          </div>
        </div>

        {/* Variable Training Frequency & Weekday Selector */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-4" style={{ borderColor: C.border }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b pb-3" style={{ borderColor: C.border }}>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Wochenplan & Frequenz anpassen
              </h2>
              <p className="text-xs text-slate-500">
                Wähle die Anzahl der Tage und deine bevorzugten Trainingstage (variabel).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Frequenz:</span>
              {[2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  onClick={() => setFrequencyDays(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    frequencyDays === num
                      ? "bg-slate-900 text-white"
                      : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                  }`}
                >
                  {num}x / Woche
                </button>
              ))}
            </div>
          </div>

          {/* Weekday Checkboxes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Aktive Trainingstage (anklicken zum Wechseln):
            </label>
            <div className="grid grid-cols-7 gap-2">
              {DAYS.map((day) => {
                const isSelected = selectedWeekdays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleWeekday(day)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                      isSelected
                        ? "bg-emerald-800 text-white border-emerald-900 shadow-xs"
                        : "bg-gray-50 text-slate-500 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {day}
                    <span className="block text-[10px] opacity-80 mt-0.5">
                      {isSelected ? "✓ Training" : "Pause"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Live Workout Timer with Voice Control */}
        {activeWorkout && (
          <div className="bg-slate-900 text-white rounded-3xl p-6 border shadow-xl space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 rounded-2xl bg-white/10">{activeWorkout.icon}</span>
                <div>
                  <h3 className="text-base font-bold">{activeWorkout.name}</h3>
                  <p className="text-xs text-emerald-300">
                    Zielmuskeln: {activeWorkout.muscles}
                  </p>
                </div>
              </div>

              {/* Timer Display */}
              <div className="flex items-center gap-4">
                <div className="text-center font-mono font-black text-3xl md:text-4xl text-emerald-400 bg-black/40 px-5 py-2 rounded-2xl border border-white/10">
                  {formatTimer(timerSeconds)}
                </div>
              </div>
            </div>

            {/* Timer Action Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {!timerRunning ? (
                  <button
                    onClick={handleStartTimer}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>▶️</span> Start
                  </button>
                ) : (
                  <button
                    onClick={handlePauseTimer}
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <span>⏸️</span> Pause
                  </button>
                )}

                <button
                  onClick={handleStopTimer}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2"
                >
                  <span>⏹️</span> Workout beenden & loggen
                </button>

                <button
                  onClick={handleResetTimer}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 font-semibold text-xs"
                >
                  Reset
                </button>
              </div>

              {/* Voice Control Button */}
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleVoiceControl}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isListeningVoice ? "bg-red-500 animate-pulse text-white" : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  <span>🎙️</span>
                  <span>{isListeningVoice ? "🔴 Sprachbefehle aktiv" : "Sprachsteuerung aktivieren"}</span>
                </button>
                {voiceLog && (
                  <span className="text-[11px] text-emerald-300 italic hidden md:inline">
                    {voiceLog}
                  </span>
                )}
              </div>
            </div>

            {/* Exercise Steps & Technique tips */}
            <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Übungs-Ablauf & Muskel-Fokus:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {activeWorkout.steps.map((st, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="text-white">{i + 1}. {st.name}</span>
                      <span className="text-emerald-400 font-mono">{st.durationOrReps}</span>
                    </div>
                    <p className="text-[11px] text-slate-300">🎯 Muskeln: <i>{st.musclesTrained}</i></p>
                    <p className="text-[10px] text-slate-400 mt-1">💡 Tipp: {st.techniqueTip}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Filters: Category & Anatomical Muscles */}
        <div className="bg-white rounded-3xl p-6 border shadow-sm space-y-4" style={{ borderColor: C.border }}>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: C.border }}>
            {["Alle", "Kraft", "Yoga", "TaiChi", "Ausdauer"].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCat === cat
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                }`}
              >
                {cat === "TaiChi" ? "☯️ Tai Chi & Qi Gong" : cat === "Yoga" ? "🧘‍♀️ Yoga Asanas" : cat}
              </button>
            ))}
          </div>

          {/* Muscle Focus Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Muskelgruppen-Fokus:</span>
            {MUSCLE_FILTERS.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMuscle(m)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                  selectedMuscle === m
                    ? "bg-emerald-800 text-white font-bold"
                    : "bg-gray-100 text-slate-600 hover:bg-gray-200"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Workouts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredWorkouts.map((w) => (
              <div
                key={w.id}
                className="p-5 rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 rounded-xl bg-white border border-gray-200 shadow-xs">{w.icon}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      {w.difficulty} · {w.duration} Min.
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{w.name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      <span className="font-semibold text-slate-700">Gezielte Muskeln:</span> {w.muscles}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 font-mono">
                    <span>⏱ {w.duration} Min.</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">🔥 ~{w.kcal} kcal</span>
                    <span>·</span>
                    <span>📋 {w.steps.length} Positionen</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveWorkout(w);
                    setTimerSeconds(0);
                    setTimerRunning(false);
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>▶️</span> Dieses Workout starten (Timer)
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
