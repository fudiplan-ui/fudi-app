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
  // 1. Push Hypertrophie
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
      {
        name: "Schrägbankdrücken mit Kurzhanteln",
        durationOrReps: "4 Sätze x 8–10 Wdh. (Kadenz 3-1-1-0)",
        musclesTrained: "Clavicularer Anteil Pectoralis Major, Vordere Schulter",
        techniqueTip: "Bank auf 30° einstellen. Schulterblätter hinten unten fixieren. 3 Sekunden kontrolliert absenken, am tiefsten Punkt Dehnung spüren, explosiv hochdrücken ohne die Ellbogen durchzustrecken."
      },
      {
        name: "Flachbankdrücken Langhantel",
        durationOrReps: "3 Sätze x 8 Wdh.",
        musclesTrained: "Pectoralis Major, Triceps brachii, Core",
        techniqueTip: "Füße fest in den Boden rammen (Leg Drive). Stange auf Brustbeinhöhe absenken, Unterarme senkrecht zum Boden halten."
      },
      {
        name: "Seitheben am Kabelzug / Kurzhantel",
        durationOrReps: "4 Sätze x 12–15 Wdh.",
        musclesTrained: "Deltoideus lateralis (Seitliche Schulter)",
        techniqueTip: "Leichte Vorneigung des Oberkörpers (15°). Bewegung aus dem Ellbogen führen, Handgelenke nicht über Ellbogenhöhe heben."
      },
      {
        name: "Dips am Barren (Körpergewicht / Zusatz)",
        durationOrReps: "3 Sätze x 10 Wdh. bis Muskelversagen",
        musclesTrained: "Unterer Pectoralis, Trizeps",
        techniqueTip: "Oberkörper leicht nach vorn neigen für Brustfokus. Bei 90° Beugung stoppen um die Schulterkapsel zu schonen."
      },
      {
        name: "Trizepsdrücken am Tau (Kabelzug)",
        durationOrReps: "3 Sätze x 12 Wdh. mit 2s Peak-Kontraktion",
        musclesTrained: "Triceps brachii (Laterales & Mediales Köpfchen)",
        techniqueTip: "Oberarme am Brustkorb anlegen. Am Tiefpunkt das Tau nach außen spreizen und den Muskel 2 Sekunden maximal kontrahieren."
      }
    ]
  },

  // 2. Pull Fokus
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
      {
        name: "Klimmzüge im schulterbreiten Obergriff",
        durationOrReps: "4 Sätze x 6–8 Wdh.",
        musclesTrained: "Latissimus dorsi, Teres major, Bizeps",
        techniqueTip: "Aus dem vollen Hang starten. Zuerst die Schulterblätter nach unten ziehen (Scapula Pull), dann das Brustbein aktiv zur Stange ziehen."
      },
      {
        name: "Vorgebeugtes Langhantelrudern",
        durationOrReps: "4 Sätze x 8–10 Wdh.",
        musclesTrained: "Rhomboidei, Latissimus, Trapezius, Erector spinae",
        techniqueTip: "Oberkörper 45° nach vorn neigen, Rücken wie ein Brett gerade spannen. Stange entlang der Oberschenkel Richtung Bauchnabel führen."
      },
      {
        name: "Facepulls mit Seil (Haltungs-Schutz)",
        durationOrReps: "3 Sätze x 15 Wdh.",
        musclesTrained: "Deltoideus posterior, Infraspinatus, Rhomboiden",
        techniqueTip: "Kabel auf Augenhöhe. Seilenden zu den Schläfen ziehen und die Schultern bewusst nach hinten-außen rotieren (Anti-Rundrücken)."
      },
      {
        name: "Incline Dumbbell Biceps Curls",
        durationOrReps: "3 Sätze x 10–12 Wdh.",
        musclesTrained: "Biceps brachii (Langer Kopf)",
        techniqueTip: "Schrägbank auf 60°. Arme hängen senkrecht herab. Volle Dehnung in der unteren Position vor Einleitung des Curls."
      }
    ]
  },

  // 3. Leg Day
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
      {
        name: "Barbell Back Squats (Tiefe Kniebeuge)",
        durationOrReps: "4 Sätze x 6–8 Wdh.",
        musclesTrained: "Quadriceps, Gluteus maximus, Adduktoren",
        techniqueTip: "Stange auf dem oberen Trapez ablegen. Hüfte nach hinten-unten absenken bis mindestens 90°. Knie drücken aktiv nach außen in Fußrichtung."
      },
      {
        name: "Rumänisches Kreuzheben (RDL)",
        durationOrReps: "3 Sätze x 10 Wdh.",
        musclesTrained: "Biceps femoris, Semitendinosus, Gluteus",
        techniqueTip: "Knie nur minimal beugen (Soft Knees). Hüfte wie gegen eine Wand nach hinten schieben, Rücken neutral halten, Dehnung in den Oberschenkelrückseiten spüren."
      },
      {
        name: "Bulgarische Ausfallschritte (Split Squats)",
        durationOrReps: "3 Sätze x 10 Wdh. pro Bein",
        musclesTrained: "Gluteus medius, Quadriceps, Rumpfstabilität",
        techniqueTip: "Hinterer Fuß auf Bank auflegen. Vorderes Knie bleibt stabil über dem Mittelfuß. Tiefe Dehnung des hinteren Hüftbeugers."
      },
      {
        name: "Stehendes Wadenheben mit Dehnpause",
        durationOrReps: "4 Sätze x 15 Wdh.",
        musclesTrained: "Gastrocnemius, Soleus",
        techniqueTip: "Auf Zehenballen explosiv hochdrücken, 1 Sekunde halten, dann 2 Sekunden tiefe Dehnung unterhalb der Stufenkante spüren."
      }
    ]
  },

  // 4. Core & Abdominals
  {
    id: 4,
    name: "Core Athletic & Anti-Rotations Stabilität",
    icon: "🛡️",
    category: "Kraft",
    difficulty: "Mittel",
    duration: 35,
    kcal: 260,
    muscles: "Transversus abdominis, Rectus abdominis, Obliquus internus/externus",
    targetedMuscleGroups: ["Core & Rücken"],
    steps: [
      {
        name: "Pallof Press am Kabelzug (Anti-Rotation)",
        durationOrReps: "3 Sätze x 12 Wdh. pro Seite",
        musclesTrained: "Schräge Bauchmuskeln, Tiefenstabilisatoren",
        techniqueTip: "Seitlich zum Kabelzug stehen. Griff vor die Brust halten und gerade nach vorn strecken. Der Körper darf sich um keinen Millimeter verdrehen."
      },
      {
        name: "Hängendes Knie- & Beinheben",
        durationOrReps: "3 Sätze x 10–12 Wdh.",
        musclesTrained: "Unterer Rectus abdominis, Iliopsoas",
        techniqueTip: "Kein Schwung holen! Das Becken aktiv nach oben einrollen (Posterior Pelvic Tilt), nicht nur die Beine anheben."
      },
      {
        name: "Dead Bug mit Atemkontrolle",
        durationOrReps: "3 Sätze x 10 Wdh. pro Seite",
        musclesTrained: "Transversus abdominis, Zwerchfell",
        techniqueTip: "Rücken fest in die Matte pressen (kein Hohlkreuz). Diagonalen Arm und Bein kontrolliert strecken bei vollem Ausatmen."
      }
    ]
  },

  // 5. Vinyasa Yoga Flow
  {
    id: 5,
    name: "Vinyasa Yoga & Asana Balance Flow",
    icon: "🧘‍♀️",
    category: "Yoga",
    difficulty: "Mittel",
    duration: 40,
    kcal: 220,
    muscles: "Transversus abdominis, Erector spinae, Psoas major, Gluteus medius",
    targetedMuscleGroups: ["Core & Rücken", "Beine & Gluteus"],
    steps: [
      {
        name: "Herabschauender Hund (Adho Mukha Svanasana)",
        durationOrReps: "5 tiefe Ujjayi-Atemzüge",
        musclesTrained: "Ischiocrurale Muskeln, Waden, Schulterblatt-Stabilisatoren",
        techniqueTip: "Hände schulterbreit auffächern. Fersen Richtung Boden schieben, Rücken lang machen, Sitzbeinhöcker nach oben-hinten strecken."
      },
      {
        name: "Krieger I & II Sequenz (Virabhadrasana)",
        durationOrReps: "Je 45 Sek. pro Seite",
        musclesTrained: "Quadrizeps, Psoas major, Gluteus medius, Deltoideus",
        techniqueTip: "Vorderes Knie exakt über dem Sprunggelenk fixieren. Hinteres Bein aktiv durchstrecken, Außenkante des hinteren Fußes erden."
      },
      {
        name: "Die Kobra (Bhujangasana Herzöffnung)",
        durationOrReps: "3 Wiederholungen mit 5s Haltephase",
        musclesTrained: "Autochthone Rückenmuskeln, Pectoralis Minor",
        techniqueTip: "Hände neben der Brust aufsetzen. Brustbein sanft heben aus Kraft des oberen Rückens, ohne Gewicht auf die Hände zu stützen."
      },
      {
        name: "Die Taube (Eka Pada Rajakapotasana)",
        durationOrReps: "Je 60 Sek. tiefe Entspannung pro Seite",
        musclesTrained: "Piriformis, Hüftbeuger, Gesäßmuskeln",
        techniqueTip: "Hüfte parallel zum vorderen Mattenrand ausrichten. Bei Ausatmung den Oberkörper über das gebeugte Knie nach vorn absenken."
      },
      {
        name: "Der Baum (Vrikshasana Balance)",
        durationOrReps: "Je 45 Sek. pro Seite",
        musclesTrained: "Fußgewölbe, Peroneus, Abduktoren, Tiefenmuskeln",
        techniqueTip: "Blick auf einen festen Punkt (Drishti). Fußsohle an die Wade oder den Oberschenkel (niemals an die Knieinnenseite) pressen."
      }
    ]
  },

  // 6. Yin Yoga Faszien-Dehnung
  {
    id: 6,
    name: "Yin Yoga Faszien-Release & Tiefenentspannung",
    icon: "🌸",
    category: "Yoga",
    difficulty: "Anfänger",
    duration: 45,
    kcal: 150,
    muscles: "Faszienzüge der Körperrückseite, Hüftkapsel, Lendenwirbelsäule",
    targetedMuscleGroups: ["Core & Rücken", "Beine & Gluteus"],
    steps: [
      {
        name: "Die Schmetterlings-Pose (Baddha Konasana)",
        durationOrReps: "3 Minuten passiv halten",
        musclesTrained: "Adduktoren, Lendenfaszie, Hüftöffner",
        techniqueTip: "Fußsohlen berühren sich, Knie fallen nach außen. Den Oberkörper rund und vollkommen ohne Muskelanspannung nach vorn sinken lassen."
      },
      {
        name: "Die Raupe (Vorbeuge sitzend)",
        durationOrReps: "3–4 Minuten passiv halten",
        musclesTrained: "Gesamte dorsale Faszienkette (Rückseite)",
        techniqueTip: "Beine locker strecken. Schwerkraft wirken lassen, Stirn Richtung Knie sinken lassen, Kopf entspannen."
      },
      {
        name: "Der Liegende Schwan (Sphinx)",
        durationOrReps: "3 Minuten",
        musclesTrained: "Lendenwirbelsäule, Bauchdecke, Thymusdrüse",
        techniqueTip: "Auf dem Bauch liegend auf die Unterarme stützen. Gesäßmuskeln komplett entspannen, sanfte Kompression im unteren Rücken zulassen."
      }
    ]
  },

  // 7. Tai Chi 24er Peking-Form
  {
    id: 7,
    name: "Tai Chi 24er Peking-Form & Qi-Gong Fluss",
    icon: "☯️",
    category: "TaiChi",
    difficulty: "Anfänger",
    duration: 35,
    kcal: 160,
    muscles: "Soleus, Vastus medialis, Core Tiefenstabilisatoren, Nacken",
    targetedMuscleGroups: ["Core & Rücken", "Beine & Gluteus", "Schulter & Nacken"],
    steps: [
      {
        name: "Eröffnung des Tai Chi (Qi Shi)",
        durationOrReps: "3 langsame Zyklen",
        musclesTrained: "Schultergürtel, Zwerchfell, Fußgewölbe",
        techniqueTip: "Arme wie schwebend bis Schulterhöhe heben, Knie sanft beugen, Atem mit Bewegung synchronisieren (Yin & Yang)."
      },
      {
        name: "Die Mähne des Wildpferdes teilen (Ye Ma Fen Zong)",
        durationOrReps: "4 Schritte im fließenden Wechsel",
        musclesTrained: "Rotatoren, Quadriceps, Hüftrotatoren",
        techniqueTip: "Schritt im 45°-Bogen. Gewicht fließend von hinten nach vorn verlagern, die Arme führen eine weit kreisende Schutzbewegung aus."
      },
      {
        name: "Der weiße Kranich breitet seine Flügel aus",
        durationOrReps: "3 Wiederholungen beidseitig",
        musclesTrained: "Gleichgewichtssinn, Fußgelenksstabilisatoren",
        techniqueTip: "Standbein fest im Boden verwurzeln, anderes Bein nur mit der Zehenspitze aufsetzen. Flügel weit und entspannt öffnen."
      },
      {
        name: "Wolkenhände (Yun Shou)",
        durationOrReps: "5 Wiederholungen mit Seitschritt",
        musclesTrained: "Obliquus internus/externus, Schultern",
        techniqueTip: "Die Bewegung entspringt aus der Taille (Dantian). Der Blick folgt sanft der jeweils oberen Handfläche wie einer Wolke."
      }
    ]
  },

  // 8. Ba Duan Jin (8 Brokate)
  {
    id: 8,
    name: "Ba Duan Jin (Die Acht Brokate des Qi Gong)",
    icon: "🕊️",
    category: "TaiChi",
    difficulty: "Anfänger",
    duration: 30,
    kcal: 140,
    muscles: "Ganzkörper-Meridiane, Schultern, Brustkorb-Kapazität",
    targetedMuscleGroups: ["Core & Rücken", "Schulter & Nacken"],
    steps: [
      {
        name: "1. Brokat: Den Himmel mit beiden Händen stützen",
        durationOrReps: "6 Wiederholungen",
        musclesTrained: "Interkostalmuskeln, Wirbelsäulen-Längsstreckung",
        techniqueTip: "Hände vor dem Unterbauch verschränken, nach oben schieben und den Blick den Händen folgen lassen. Reguliert den Dreifachen Erwärmer."
      },
      {
        name: "2. Brokat: Den Bogen spannen wie auf einen Adler",
        durationOrReps: "6 Wiederholungen (Reiterstellung Ma Bu)",
        musclesTrained: "Adduktoren, Quadrizeps, Rhomboiden",
        techniqueTip: "Tiefe Kniebeuge einnehmen. Einen Arm waagerecht strecken mit Zeigefingerhaltung (Schwertfinger), andere Hand zieht die Sehne."
      },
      {
        name: "3. Brokat: Milz und Magen durch Einzelarm-Heben regulieren",
        durationOrReps: "6 Wiederholungen im Wechsel",
        musclesTrained: "Schräge Bauchmuskeln, Zwerchfell, Flanken",
        techniqueTip: "Eine Handfläche drückt nach oben in den Himmel, die andere nach unten zur Erde. Sanfte Dehnung im Oberbauch."
      }
    ]
  },

  // 9. HIIT Tabata Fatburn
  {
    id: 9,
    name: "HIIT Tabata Fatburn & Mitochondrien-Boost",
    icon: "🔥",
    category: "Ausdauer",
    difficulty: "Fortgeschritten",
    duration: 25,
    kcal: 360,
    muscles: "Gesamtkörper, Myokard, Typ-II Muskelfasern",
    targetedMuscleGroups: ["Beine & Gluteus", "Core & Rücken"],
    steps: [
      {
        name: "Burpees mit explosivem Hochstrecksprung",
        durationOrReps: "40s Belastung / 20s Pause",
        musclesTrained: "Ganzkörper, Brust, Beine, Herzkreislauf",
        techniqueTip: "Brust bis zum Boden führen. Hüfte explosiv nach vorn schnappen lassen und weich auf dem ganzen Fuß landen."
      },
      {
        name: "Mountain Climbers im Höchsttempo",
        durationOrReps: "40s Belastung / 20s Pause",
        musclesTrained: "Rectus abdominis, Schultern, Hüftbeuger",
        techniqueTip: "Liegestützposition halten. Schultern über den Handgelenken fixieren, Knie im Sekundentakt zur Brust treiben."
      },
      {
        name: "Jump Squats (Kniebeugensprung)",
        durationOrReps: "40s Belastung / 20s Pause",
        musclesTrained: "Quadrizeps, Gesäß, Waden",
        techniqueTip: "Bis in die Hocke absenken, dann explosionsartig nach oben abspringen. Lautlos und weich auf den Fußballen abfedern."
      }
    ]
  },

  // 10. Pilates Reformer Matwork
  {
    id: 10,
    name: "Pilates Core Reformer Matwork",
    icon: "🩰",
    category: "Mobilitaet",
    difficulty: "Mittel",
    duration: 35,
    kcal: 190,
    muscles: "Powerhouse, Beckenboden, Multifidi, Transversus",
    targetedMuscleGroups: ["Core & Rücken"],
    steps: [
      {
        name: "The Hundred (Klassische Hunderter-Atmung)",
        durationOrReps: "100 pumpende Armbewegungen",
        musclesTrained: "Rectus abdominis, Transversus, Zwerchfell",
        techniqueTip: "Kopf und Schulterblätter heben. Beine im 45°-Winkel gestreckt halten. 5 Zählzeiten einatmen, 5 Zählzeiten kraftvoll ausatmen."
      },
      {
        name: "Criss-Cross (Diagonale Rumpf-Präzision)",
        durationOrReps: "3 Sätze x 16 Wdh. (8 pro Seite)",
        musclesTrained: "Obliquus internus/externus",
        techniqueTip: "Nicht am Nacken ziehen! Die Achselhöhle zieht zum gegenüberliegenden Knie, Ellbogen bleiben maximal weit geöffnet."
      },
      {
        name: "Swimming (Dynamische Rückenstreckung)",
        durationOrReps: "3 Sätze x 30 Sekunden",
        musclesTrained: "Erector spinae, Gluteus, hintere Schulter",
        techniqueTip: "In Bauchlage Arme und Beine paddelnd in der Luft bewegen. Nacken in Verlängerung der Wirbelsäule halten."
      }
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

            {/* Exercise Steps & Visual Posture Execution Cards */}
            <div className="mt-6 pt-5 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider text-emerald-400">
                    Visuelle Übungsausführung & Haltungs-Guide:
                  </h4>
                  <p className="text-xs text-slate-300">
                    Detaillierte Schritt-für-Schritt Haltungskarten mit anatomischen Zielmuskeln und Technik-Tipps.
                  </p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                  {activeWorkout.steps.length} Positionen
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeWorkout.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-emerald-500/60 transition-all space-y-3"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-mono font-bold text-xs flex items-center justify-center">
                          {i + 1}
                        </span>
                        <h5 className="font-bold text-xs md:text-sm text-white">{st.name}</h5>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 shrink-0">
                        {st.durationOrReps}
                      </span>
                    </div>

                    {/* Anatomical Target Muscles Highlight */}
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        <span>🎯</span> <span>Gezielte Muskelgruppen:</span>
                      </div>
                      <p className="text-xs text-slate-200 font-mono font-medium">
                        {st.musclesTrained}
                      </p>
                    </div>

                    {/* Step-by-Step Technique & Posture Cue */}
                    <div className="text-xs text-slate-300 leading-relaxed space-y-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-300">
                        <span>💡</span> <span>Exakte Haltung & Ausführung:</span>
                      </div>
                      <p className="text-slate-300 bg-white/5 p-2.5 rounded-xl border border-white/5">
                        {st.techniqueTip}
                      </p>
                    </div>

                    {/* Audio Coach Trigger for this exercise */}
                    <button
                      onClick={() => {
                        if ('speechSynthesis' in window) {
                          window.speechSynthesis.cancel();
                          const u = new SpeechSynthesisUtterance(`Übung ${i+1}: ${st.name}. ${st.techniqueTip}`);
                          u.lang = 'de-DE';
                          u.rate = 0.95;
                          window.speechSynthesis.speak(u);
                        }
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 pt-1"
                    >
                      <span>🔊</span> <span>Technik-Coach vorlesen</span>
                    </button>
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
