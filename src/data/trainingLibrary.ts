/**
 * Erweiterte Trainings- & Ernährungs-Bibliothek für FUDI Fitness.
 * Kompatibel zum WorkoutItem der FitnessTracker-Seite (import type).
 * RECHTSSICHERHEIT: kcal sind MET-basierte Richtwerte (Ainsworth-Kompendium),
 * keine individuellen Verbrauchszusagen. Keine Heilversprechen; Disclaimer UI.
 */

import type { WorkoutItem } from "../pages/FitnessTracker";

export const EXTRA_WORKOUTS: WorkoutItem[] = [
  {
    id: 101,
    name: "HIIT Full-Body Blitz (30 Sek. an / 30 Sek. Pause)",
    icon: "🔥",
    category: "HIIT",
    difficulty: "Mittel",
    duration: 20,
    kcal: 260,
    muscles: "Ganzkörper, Herz-Kreislauf-System, Core",
    targetedMuscleGroups: ["Ganzkörper", "Core & Rücken"],
    steps: [
      { name: "Burpees (Step-Variante bei Gelenkproblemen)", durationOrReps: "8 Runden x 30 Sek. an / 30 Sek. Pause", musclesTrained: "Beine, Core, Schultern, Herz-Kreislauf", techniqueTip: "Aus der Hocke die Füße nach hinten werfen, Hüfte tief halten, aufspringen. Weich über die Fußballen landen – bei Schmerzen auf die Step-Variante ausweichen." },
      { name: "Mountain Climbers", durationOrReps: "4 Runden x 30 Sek.", musclesTrained: "Core, Hüftbeuger, Schultern stabil", techniqueTip: "Schultern über den Handgelenken halten. Knie zügig zur Brust ziehen, Gesäß nicht hochschieben – der Oberkörper bleibt ruhig." },
      { name: "Kniebeugen mit Sprung", durationOrReps: "4 Runden x 30 Sek.", musclesTrained: "Quadrizeps, Gluteus, Waden", techniqueTip: "Direkt aus der Landung in die nächste Hocke federn. Sprunghöhe ist zweitrangig – die saubere Landung zählt." },
      { name: "Plank Shoulder Taps", durationOrReps: "3 Runden x 30 Sek.", musclesTrained: "Core (Anti-Rotation), Schultern", techniqueTip: "Hüfte so ruhig wie möglich halten, während die Hand den gegenüberliegenden Schulterkorb antippt. Langsam kontrolliert schlägt schnell wackelig." },
    ],
  },
  {
    id: 102,
    name: "Sprint-Intervalle (Bahn / Steckmaschine)",
    icon: "💨",
    category: "HIIT",
    difficulty: "Fortgeschritten",
    duration: 25,
    kcal: 320,
    muscles: "Beine, Hüftbeuger, Herz-Kreislauf-System",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Einlaufen", durationOrReps: "5 Minuten locker", musclesTrained: "Gesamte Muskulatur, Sehnen", techniqueTip: "Erst steigern, wenn der Puls angezogen hat. Kleine Schritte, aufrechte Haltung." },
      { name: "Sprint-Intervalle", durationOrReps: "8 x 30 Sek. voll / 90 Sek. Trab", musclesTrained: "Schnelligkeitsfasern, Beine", techniqueTip: "Kurze Kraftschritte, Arme aktiv mitführen, Oberkörper leicht vorgebeugt. In der Pause traben, nicht stehen bleiben." },
      { name: "Abwärmen & Dehnen", durationOrReps: "5 Min. locker + Waden/Oberschenkel dehnen", musclesTrained: "Regeneration, Beweglichkeit", techniqueTip: "Puls langsam absenken. Dehnungen sanft ohne Federn, 20–30 Sek. halten." },
    ],
  },
  {
    id: 103,
    name: "Kettlebell Swing Flow",
    icon: "🫀",
    category: "Kraft",
    difficulty: "Mittel",
    duration: 25,
    kcal: 280,
    muscles: "Gluteus, Ischiocrurale Muskeln, Core, Unterer Rücken",
    targetedMuscleGroups: ["Beine & Gluteus", "Core & Rücken"],
    steps: [
      { name: "Kettlebell Deadlift", durationOrReps: "3 Sätze x 10 Wdh.", musclesTrained: "Hüftstreckung, Gesäß, Rückenstrecker", techniqueTip: "Gewicht zwischen die Füße, Hüfte nach hinten, Rücken gerade, aus den Füßen aufstellen. Die Hantel bleibt nah am Körper." },
      { name: "Russian Swing", durationOrReps: "5 Sätze x 15 Wdh.", musclesTrained: "Gluteus, Hamstrings, Core", techniqueTip: "Der Antrieb kommt aus der Hüfte, nicht aus den Armen! Hüfte explosiv nach vorn schieben, unten leicht an den Oberschenkel kratzen lassen." },
      { name: "Goblet Squat", durationOrReps: "3 Sätze x 10 Wdh.", musclesTrained: "Quadrizeps, Gluteus, Core", techniqueTip: "Kettlebell eng an der Brust. Ellbogen zwischen die Knie führen, Ferse bleibt am Boden, Brust aufrecht." },
      { name: "Farmer Carry", durationOrReps: "3 Runden x 30 Meter", musclesTrained: "Griffkraft, Core, Trapezius", techniqueTip: "Schultern aktiv nach unten ziehen, aufrecht gehen, kein Pendeln – der Bauch bleibt angespannt." },
    ],
  },
  {
    id: 104,
    name: "Laufen – Grundlagenausdauer (Lockerer Dauerlauf)",
    icon: "🏃",
    category: "Ausdauer",
    difficulty: "Anfänger",
    duration: 35,
    kcal: 350,
    muscles: "Beine, Herz-Kreislauf-System",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Gehen-Joggen-Wechsel (Einsteiger)", durationOrReps: "35 Min.: 2 Min. gehen / 3 Min. joggen, im Wechsel", musclesTrained: "Grundlagenausdauer (aerobe Basis)", techniqueTip: "So locker joggen, dass ein ganzer Satz Sprechen möglich wäre (Talk-Test). Der Fuß landet unter dem Körper, nicht weit nach vorn." },
      { name: "Dauerlauf (Fortgeschrittene)", durationOrReps: "30–40 Min. im ruhigen Sprechtempo", musclesTrained: "Aerobe Kapazität", techniqueTip: "Umlenkfrequenz ca. 170–180 Schritte/Minute, Hüfte aufrecht. Pace so wählen, dass die zweite Hälfte leichter wirkt als die erste." },
      { name: "Auslaufen & Dehnen", durationOrReps: "5 Min. auslaufen + Waden/Ischios dehnen", musclesTrained: "Regeneration", techniqueTip: "Nie abrupt stoppen. Waden, Ischios und Hüftbeuger je 20–30 Sek. sanft dehnen – bei anhaltendem Fußschmerz ärztlich abklären." },
    ],
  },
  {
    id: 105,
    name: "Radfahren / Ergometer-Intervalle",
    icon: "🚴",
    category: "Ausdauer",
    difficulty: "Mittel",
    duration: 40,
    kcal: 400,
    muscles: "Oberschenkel, Gesäß, Waden, Herz-Kreislauf",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Aufwärmen", durationOrReps: "8 Min. lockeres Fahren", musclesTrained: "Beine, Gelenke", techniqueTip: "Sitzhöhe so einstellen, dass das Knie im tiefsten Punkt leicht gebeugt bleibt. Tretfrequenz hoch halten (80–90/min)." },
      { name: "Intervall-Block", durationOrReps: "6 x 3 Min. zügig / 3 Min. locker", musclesTrained: "Aerobe & anaerobe Kapazität", techniqueTip: "In den harten Blöcken wird die Sprache knapp, aber kein Stöhnen. Oberkörper ruhig, nur die Beine arbeiten." },
      { name: "Cool-down", durationOrReps: "6 Min. sehr locker + Quadrizeps dehnen", musclesTrained: "Regeneration", techniqueTip: "Widerstand auf Minimum. Danach Quadrizeps und Waden je 20 Sek. sanft dehnen." },
    ],
  },
  {
    id: 106,
    name: "Schwimmtraining – Technik & Kondition",
    icon: "🏊",
    category: "Ausdauer",
    difficulty: "Mittel",
    duration: 40,
    kcal: 380,
    muscles: "Latissimus, Schultern, Beine, Herz-Kreislauf",
    targetedMuscleGroups: ["Rücken & Bizeps", "Schulter & Nacken", "Ganzkörper"],
    steps: [
      { name: "Einlaufen Kraul", durationOrReps: "200 m locker", musclesTrained: "Ganzkörper, Gelenke (gelenkschonend)", techniqueTip: "Beim Kraul seitlich rollen statt nur die Arme zu drehen. Ausatmen unter Wasser, Kopf bleibt in Verlängerung der Wirbelsäule." },
      { name: "Technik-Drills (Brett/Strömungsboard)", durationOrReps: "4 x 50 m Fokus auf einen Schlag", musclesTrained: "Schultern, Latissimus, Koordination", techniqueTip: "Einmal pro Durchgang nur auf EIN Detail achten (z. B. Daumen zuerst ins Wasser). Kurze Pausen zwischendurch sind erlaubt." },
      { name: "Dauerzug", durationOrReps: "400 m gleichmäßig", musclesTrained: "Aerobe Kapazität", techniqueTip: "Zügig genug, dass der Atemrhythmus stabil bleibt. Bei Technikverschlechterung Pause machen – mehr Kilometer schaden dann nur." },
      { name: "Abwärmen", durationOrReps: "100 m locker + Schulter-/Wadendehnung", musclesTrained: "Regeneration", techniqueTip: "Sanft auslaufen. Schultern und Waden dehnen; der Schultergelenksschutz leidet sonst unter der Wiederholungszahl." },
    ],
  },
  {
    id: 107,
    name: "Fußball-Fitness (Ball-nahes Ausdauer- & Krafttraining)",
    icon: "⚽",
    category: "Sportarten",
    difficulty: "Mittel",
    duration: 45,
    kcal: 430,
    muscles: "Beine, Hüftbeuger, Core, Herz-Kreislauf",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Aufwärmen mit Ball", durationOrReps: "8 Min. Dribbling + Passübungen", musclesTrained: "Beine, Koordination", techniqueTip: "Kurze Dribblings mit beiden Füßen, dann einsteigende Pässe an die Wand. Erst danach in die hohe Intensität." },
      { name: "Shuttle Runs (5-10-5)", durationOrReps: "6 Durchgänge", musclesTrained: "Schnelligkeit, Richtungswechsel", techniqueTip: "Niedrige Hüftposition beim Umkehrpunkt, kurze Brems-Schritte. Oberkörper bleibt über dem Standfuß." },
      { name: "Sprungkraft (Box Jumps / T-Beinbeuger)", durationOrReps: "4 Sätze x 8 Wdh. pro Bein", musclesTrained: "Quadrizeps, Gluteus, Waden", techniqueTip: "Box-Höhe so wählen, dass die Landung lautlos gelingt. Bei Einbein-Variation: Knie stabil über dem Zeh." },
      { name: "Kern-Rotationen mit Ball", durationOrReps: "3 Sätze x 12 pro Seite", musclesTrained: "Schräge Bauchmuskulatur, Rotatoren", techniqueTip: "Hüfte ruhig lassen, Rotation kommt aus dem Oberkörper – genau wie beim Schuss mit dem spannenden Fuß." },
    ],
  },
  {
    id: 108,
    name: "Tennis-Fitness (Beinarbeit & Schulterstabilität)",
    icon: "🎾",
    category: "Sportarten",
    difficulty: "Mittel",
    duration: 40,
    kcal: 360,
    muscles: "Beine, Schultern, Core, Rotatorenmanschette",
    targetedMuscleGroups: ["Beine & Gluteus", "Schulter & Nacken"],
    steps: [
      { name: "Beinarbeit: Split Steps & Seitläufe", durationOrReps: "6 Runden x 45 Sek.", musclesTrained: "Adduktoren, Oberschenkel, Reaktionsvermögen", techniqueTip: "Split Step immer dann, wenn der Gegner den Ball trifft. Kleine, schnelle Schritte statt großer Hüpfer." },
      { name: "Rotatorenmanschette mit Band", durationOrReps: "3 Sätze x 12 pro Richtung", musclesTrained: "Infraspinatus, Supraspinatus, Teres minor", techniqueTip: "Ellbogen am Körper fixiert, nur die Außenrotation arbeitet. Leichtes Band genügt – hier zählt Präzision, nicht Gewicht." },
      { name: "Ausfallschritte mit Rotation", durationOrReps: "3 Sätze x 8 pro Bein", musclesTrained: "Quadrizeps, Gluteus, Core", techniqueTip: "Im Ausfallschritt den Oberkörper zur Standseite rotieren – wie beim Vorhand-Vollarm. Knie bleibt über der Ferse." },
      { name: "Anti-Rotations-Press (Band/Palu)", durationOrReps: "3 Sätze x 10 pro Seite", musclesTrained: "Core (Anti-Rotation), Schultern", techniqueTip: "Der Druck nach vorn darf den Oberkörper NICHT verdrehen – genau diese Stabilität schützt den Rücken beim Schlag." },
    ],
  },
  {
    id: 109,
    name: "Basketball – Aufwärmen & Skill-Fitness",
    icon: "🏀",
    category: "Sportarten",
    difficulty: "Anfänger",
    duration: 35,
    kcal: 340,
    muscles: "Beine, Waden, Core, Schultern",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Ballhandling-Drills", durationOrReps: "6 Min. (Dribbling hoch/tief, Figure-8)", musclesTrained: "Handgelenk, Koordination", techniqueTip: "Blick nach vorn, nicht auf den Ball. Ball hart dribbeln – je schneller der Ball, desto mehr Kontrolle." },
      { name: "Layup-Ladder", durationOrReps: "5 Runden x 4 Wdh. (2 pro Seite)", musclesTrained: "Beine, Sprungkraft, Koordination", techniqueTip: "Anlauf mit Schritt-Rhythmus (rechts-links-sprung bei rechter Seite). Hand führt den Ball sanft an die Bretter." },
      { name: "Defensive Slides", durationOrReps: "5 Runden x 30 Sek.", musclesTrained: "Adduktoren, Gluteus, Hüftstreckung", techniqueTip: "Nie übereinandertreten, Hüfte tief, Hände aktiv. Der Oberkörper bleibt aufrecht – Wer rutscht, verliert." },
      { name: "Wurf-Endurance", durationOrReps: "50 Würfe aus der Bewegung", musclesTrained: "Schultern, Trizeps, Follow-Through", techniqueTip: "Aus der Balance heraus sauber beenden. Nach dem Release bleibt der Korbkorb stehen (Gooseneck) – das trainiert die saubere Wurfbahn." },
    ],
  },
  {
    id: 110,
    name: "Wandern / Steigengang (Ausdauer & Beine)",
    icon: "🥾",
    category: "Sportarten",
    difficulty: "Anfänger",
    duration: 60,
    kcal: 420,
    muscles: "Beine, Waden, Herz-Kreislauf, Core",
    targetedMuscleGroups: ["Beine & Gluteus", "Ganzkörper"],
    steps: [
      { name: "Aufwärmen im Gehen", durationOrReps: "10 Min. flaches Tempo", musclesTrained: "Gesamte Muskulatur", techniqueTip: "Stöcke mittig einstellen (Handgelenk rechtwinklig). Erst wenn die Gelenke warm sind, geht es bergauf." },
      { name: "Strecken bergauf", durationOrReps: "30–40 Min. gleichmäßiges Steigentempo", musclesTrained: "Quadrizeps, Waden, aerobe Kapazität", techniqueTip: "Kleine Schritte, Fersen zuerst auf flachem Gelände; bei steilen Passagen vorne drücken. Atemrhythmus: zwei Schritte ein, zwei Schritte aus." },
      { name: "Abstieg (Gelenkschutz)", durationOrReps: "15 Min. kontrolliert", musclesTrained: "Oberschenkel (exzentrisch), Knie", techniqueTip: "Knie leicht gebeugt und weich federn – die Bremsarbeit macht der Muskel, nicht das Gelenk. Stöcke entlasten die Knie spürbar." },
      { name: "Nach dem Gang", durationOrReps: "5 Min. lockeres Gehen + Waden dehnen", musclesTrained: "Regeneration", techniqueTip: "Nicht sofort stehen bleiben. Waden, Oberschenkel und Hüftbeuger dehnen; Einlagen bei bekannter Überpronation prüfen." },
    ],
  },
  {
    id: 111,
    name: "Calisthenics Basics (Körpergewicht – zu Hause)",
    icon: "🤸",
    category: "Kraft",
    difficulty: "Anfänger",
    duration: 30,
    kcal: 250,
    muscles: "Ganzkörper, Core, Schultern",
    targetedMuscleGroups: ["Ganzkörper", "Core & Rücken"],
    steps: [
      { name: "Liegestütze (Schrägbank-Variante startet leichter)", durationOrReps: "3 Sätze x 6–12 Wdh.", musclesTrained: "Pectoralis, Trizeps, Core", techniqueTip: "Körper von Kopf bis Ferse eine gerade Linie. Ellbogen ca. 45° vom Körper – nicht seitlich abstehen." },
      { name: "Kniebeugen (Bodyweight Squat)", durationOrReps: "3 Sätze x 15 Wdh.", musclesTrained: "Quadrizeps, Gluteus", techniqueTip: "Arme nach vorn zum Ausbalancieren. Tiefe so weit, dass die Ferse am Boden bleibt und der Rücken gerade ist." },
      { name: "Plank", durationOrReps: "3 x 30–60 Sek.", musclesTrained: "Core (tief und oberflächlich)", techniqueTip: "Gesäß leicht anspannen, Becken leicht nach hinten kippen. Gesäß niemals hochschieben oder durchhängen lassen." },
      { name: "Superman (Rückenstrecker)", durationOrReps: "3 Sätze x 12 Wdh.", musclesTrained: "Erector spinae, Gesäß", techniqueTip: "Arme und Beine gleichzeitig anheben, ohne im unteren Rücken zu schnappen. Oben eine Sekunde halten, langsam absenken." },
    ],
  },
  {
    id: 112,
    name: "Kraft-Einstieg: Ganzkörper mit Langhantel",
    icon: "🏋️",
    category: "Kraft",
    difficulty: "Anfänger",
    duration: 45,
    kcal: 330,
    muscles: "Ganzkörper (Kniebeugen, Rudern, Drücken)",
    targetedMuscleGroups: ["Ganzkörper", "Beine & Gluteus"],
    steps: [
      { name: "Kniebeugen (Back Squat)", durationOrReps: "3 Sätze x 8–10 Wdh.", musclesTrained: "Quadrizeps, Gluteus, Core", techniqueTip: "Stange auf den Trapezius legen, nicht auf die Nackenwirbel. Hüfte nach hinten, Brust aufrecht, Tiefe bis Oberschenkel parallel." },
      { name: "Schulterdrücken (stehend)", durationOrReps: "3 Sätze x 8–10 Wdh.", musclesTrained: "Deltoideus, Trizeps", techniqueTip: "Bauch und Gesäß anspannen, damit sich der Rücken nicht überstreckt. Stange senkrecht über dem Kopf führen." },
      { name: "Rudern (vorgebeugt)", durationOrReps: "3 Sätze x 10 Wdh.", musclesTrained: "Latissimus, Rhomboideus, Bizeps", techniqueTip: "Rücken gerade, Stange zum Bauchnabel ziehen. Schulterblätter aktiv zusammenführen, nicht mit dem Rumpf schaukeln." },
      { name: "Gluteus-Hip Thrust", durationOrReps: "3 Sätze x 12 Wdh.", musclesTrained: "Gluteus maximus", techniqueTip: "Kinn leicht an die Brust ziehen, oben zwei Sekunden Gesäß maximal anspannen. Die Hüfte, nicht der Rücken, arbeitet." },
    ],
  },
  {
    id: 113,
    name: "Geh- & Gleichgewichts-Training (Alltagstauglich)",
    icon: "🚶",
    category: "Alltag",
    difficulty: "Anfänger",
    duration: 20,
    kcal: 120,
    muscles: "Beine, Core, propriozeptive Wahrnehmung",
    targetedMuscleGroups: ["Ganzkörper", "Koordination & Balance"],
    steps: [
      { name: "Rückwärtsgehen", durationOrReps: "3 x 30 Meter", musclesTrained: "Quadrizeps (exzentrisch), Koordination", techniqueTip: "Blick geradeaus, kleine Schritte, Fußballen zuerst aufsetzen. Rückwärtsgehen entlastet die Knie und trainiert die Balance." },
      { name: "Einbeinstand", durationOrReps: "3 x 30 Sek. pro Bein", musclesTrained: "Propriozeption, Sprunggelenk, Core", techniqueTip: "Blick auf einen festen Punkt richten. Bei leichter Instabilität: Augen schließen wird später zum nächsten Schritt." },
      { name: "Zehenspaziergang & Fersenlauf", durationOrReps: "4 Runden x 20 Meter", musclesTrained: "Waden, Unterschenkel (Pronationssupination)", techniqueTip: "Bewusst langsam und kontrolliert. Diese kleinen Muskeln stabilisieren den Fuß – besonders wichtig beim Laufen." },
      { name: "Treppe auf-/absteigen (kontrolliert)", durationOrReps: "3 Runden", musclesTrained: "Beine, Gelenkstabilität", techniqueTip: "Ein Griff – ein Schritt, Handlauf nutzen. Beim Abstieg Knie weich federn lassen." },
    ],
  },
  {
    id: 114,
    name: "Tanz-Aerobic / Cardio-Dance",
    icon: "💃",
    category: "Alltag",
    difficulty: "Anfänger",
    duration: 40,
    kcal: 320,
    muscles: "Ganzkörper, Herz-Kreislauf, Koordination",
    targetedMuscleGroups: ["Ganzkörper", "Koordination & Balance"],
    steps: [
      { name: "Warm-Up Groove", durationOrReps: "8 Min. lockere Schritte", musclesTrained: "Gesamte Muskulatur", techniqueTip: "Schultern lockern, Hüfte mitnehmen. Fußspitzen weich aufsetzen – die Musik gibt das Tempo vor, nicht der Ehrgeiz." },
      { name: "Hauptblock (Choreo-Abschnitte)", durationOrReps: "25 Min. in Intervallen", musclesTrained: "Aerobe Kapazität, Koordination", techniqueTip: "Erst die Schritte, dann die Arme. Kleine Bewegungen sind kontrollierter als große – Tempo kommt mit der Übung." },
      { name: "Cool-Down & Stretch", durationOrReps: "7 Min. langsamer werden + dehnen", musclesTrained: "Regeneration", techniqueTip: "Schrittgröße und Musiktempo langsam reduzieren. Waden, Oberschenkel und Hüften sanft dehnen." },
    ],
  },
];

/**
 * Ernährungs-Timing vor und nach dem Training – nach Trainingsart.
 * RECHTSSICHERHEIT: Allgemeinbildung nach DGE-Leitlinien Sporternährung;
 * Mengen bewusst als "Beispiele", da der Bedarf individuell variiert.
 * Diabetes: Kohlenhydrat-/Insulin-Timing IMMER mit Behandlungsteam absprechen.
 */
export interface NutritionTimingGuide {
  id: string;
  title: string;
  icon: string;
  categories: string[];
  before: { window: string; options: string[] };
  after: { window: string; options: string[] };
  dietStyles: { name: string; hint: string }[];
  bodyNote: string;
}

export const NUTRITION_TIMING: NutritionTimingGuide[] = [
  {
    id: "kraft",
    title: "Krafttraining & Muskelaufbau",
    icon: "🏋️",
    categories: ["Kraft"],
    before: {
      window: "2–3 Stunden vor dem Training (kleine Mahlzeit)",
      options: [
        "Ausgewogene Mahlzeit mit Kohlenhydraten + Eiweiß: z. B. Reis mit Hühnchen, Vollkornpasta mit Tomatensauce, Quark mit Haferflocken",
        "Wenn wenig Zeit: Banane + Joghurt oder Butterbrot mit Käse ca. 60–90 Min. vorher",
        "Wasser über den Tag verteilt – Dehydration verschlechtert die Leistung spürbar",
      ],
    },
    after: {
      window: "In der ersten Stunde nach dem Training",
      options: [
        "Eiweißreiche Mahlzeit mit Kohlenhydraten: z. B. Skyr mit Beeren, Lachs mit Kartoffeln, Tofu-Gemüse-Reis",
        "Faustformel Eiweiß: ca. 1,6 g je kg Körpergewicht pro Tag bei sportlich Aktiven (DGE-Range)",
        "Flüssigkeit nachschieben – bei starkem Schwitzen mineralstoffhaltige Getränke prüfen",
      ],
    },
    dietStyles: [
      { name: "Klassisch", hint: "Jede handelsübliche Kombination aus Kohlenhydraten und Eiweiß funktioniert." },
      { name: "Vegetarisch", hint: "Quark, Skyr, Eier, Hülsenfrüchte und Tofu liefern das Eiweiß; Kombination mit Getreide vervollständigt das Aminosäureprofil." },
      { name: "Vegan", hint: "Erbsen- oder Sojapulver können ergänzen; auf B12- und Eisenversorgung achten (Beratung empfohlen)." },
      { name: "Low Carb / Keto", hint: "Kann die Leistung in hohen Satzanzahlen dämpfen – bei Bedarf Kohlenhydrate gezielt um das Training legen." },
    ],
    bodyNote:
      "Krafttraining stimuliert den Muskelaufbau. Kombination aus progressives Training, ausreichend Eiweiß und Regeneration ist der wirksamste Hebel – Supplemente nur, wenn die Ernährung Lücken lässt.",
  },
  {
    id: "ausdauer",
    title: "Ausdauer & Dauersport (Laufen, Rad, Schwimmen)",
    icon: "🏃",
    categories: ["Ausdauer", "HIIT"],
    before: {
      window: "2–3 Std. vorher (größer) bzw. 30–60 Min. (klein)",
      options: [
        "Kohlenhydratreich, fettarm, ballaststoffarm: Haferbrei mit Banane, Brezel mit Marmelade, Reiswaffeln",
        "Für Einheiten >75 Min. die Speicher bewusst auffüllen – sie sind limitiert",
        "Klein vor dem Start: Banane oder Gel – große Mahlzeiten belasten den Magen",
      ],
    },
    after: {
      window: "Sofort bis 2 Stunden nach dem Training",
      options: [
        "Verhältnis ca. 3:1 Kohlenhydrate:Eiweiß (Milchreis mit Quark, Brezel mit Schinken, Smoothie mit Hafer)",
        "Glykogen-Auffüllung gelingt am besten in den ersten Stunden",
        "Bei zweitem Training am selben Tag: Zeitfenster aktiv nutzen",
      ],
    },
    dietStyles: [
      { name: "Klassisch", hint: "Getreide, Kartoffeln, Reis und Obst sind die Standard-Performance-Lebensmittel." },
      { name: "Vegan", hint: "Haferdrink-Smoothies, Bohnen-Wrap, Reis mit Hülsenfrüchten; auf Eisen und B12 achten." },
      { name: "Vegetarisch", hint: "Magerquark, Joghurt und Eier passen als Regenerations-Eiweiß." },
      { name: "Intervallfasten", hint: "Lockeres nüchternes Training ist machbar; intensive Einheiten leiden oft ohne Vorgabe." },
    ],
    bodyNote:
      "Ausdauertraining verbessert die aerobe Kapazität des Herz-Kreislauf-Systems. Die Kohlenhydrat-Zufuhr beeinflusst, wie lange die Intensität gehalten werden kann.",
  },
  {
    id: "sportarten",
    title: "Ball- & Ausdauersportarten (Fußball, Tennis, Basketball)",
    icon: "⚽",
    categories: ["Sportarten"],
    before: {
      window: "2–3 Stunden vor dem Spiel, leichte Kost 60 Min. vorher",
      options: [
        "Vor dem Spiel: nahrhafte Kohlenhydrat-Basis (Pasta, Reis, Kartoffeln) mit magerem Eiweiß",
        "30–60 Min. vorher nur noch wenig: Banane, Energieriegel, Sportgetränk",
        "Ausreichend trinken – schon leichte Dehydration verlangsamt Reaktion und Entscheidungsfindung",
      ],
    },
    after: {
      window: "Innerhalb von 90 Minuten nach dem Spiel",
      options: [
        "Regenerationsmahlzeit mit Kohlenhydraten + Eiweiß: Wrap mit Hähnchen, Magerquark mit Müsli, Reis mit Ei",
        "Bei mehreren Spielen pro Woche die Mahlzeiten entsprechend dimensionieren",
        "Elektrolyte bei starkem Schwitzen auffüllen (natriumhaltige Snacks oder Sportgetränk)",
      ],
    },
    dietStyles: [
      { name: "Klassisch", hint: "Standard-Ernährung mit ausreichend Getreide, Gemüse und Eiweißquellen passt zu Spieltagen." },
      { name: "Vegetarisch / Vegan", hint: "Hülsenfrüchte, Tofu und pflanzliche Eiweiß-Shakes funktionieren – vor dem Spiel eher verträgliche, fettarme Varianten wählen." },
      { name: "Low Carb", hint: "Bei hoher Belastungsdichte (90 Min. Fußball) sind Kohlenhydrate für Sprint- und Duellsituationen oft der limitierende Faktor." },
    ],
    bodyNote:
      "Ballspiele kombinieren Ausdauer, Sprint und Koordination. Regularität fördert Knochen, Gelenkstabilität und Reaktion – die Ernährung sichert, dass Leistung und Regeneration mithalten.",
  },
  {
    id: "hiit",
    title: "HIIT & Intervalltraining",
    icon: "🔥",
    categories: ["HIIT"],
    before: {
      window: "1,5–3 Stunden vorher (leicht verdaulich)",
      options: [
        "Moderat kohlenhydratreich, wenig Fett: Haferflocken mit Banane, Reis mit magerem Hähnchen",
        "Intervalle direkt nüchtern nur für erfahrene Athletinnen/Athleten sinnvoll",
        "Optional Koffein – nicht auf nüchternen Magen, wenn der Magen sensibel reagiert",
      ],
    },
    after: {
      window: "Nach dem Intervalltraining",
      options: [
        "Eiweißreich + Kohlenhydrate: Eier mit Vollkornbrot, Skyr mit Früchten",
        "Intervalle beanspruchen die Speicher stark – die erste Mahlzeit danach zählt",
        "Ausreichend trinken, die Verluste durch Intervalle sind hoch",
      ],
    },
    dietStyles: [
      { name: "Klassisch", hint: "Keine Besonderheiten – auf ausreichende Gesamtenergie achten." },
      { name: "Vegetarisch / Vegan", hint: "Bohnen-Linsen-Gerichte mit Reis funktionieren als Regenerationsmahlzeit." },
    ],
    bodyNote:
      "Intervalltraining verbessert die anaerobe Kapazität effizient in kurzer Zeit. Wegen der hohen Belastung ist bewusste Regeneration besonders wichtig.",
  },
  {
    id: "yoga",
    title: "Yoga, Tai Chi & Mobilität",
    icon: "🧘",
    categories: ["Yoga", "TaiChi", "Mobilitaet"],
    before: {
      window: "Leichter Snack 60–90 Min. vorher oder nüchtern",
      options: [
        "Bei flüssigen Sequenzen eher nüchtern oder nur wenig: Kräutertee, kleine Banane",
        "Große Mahlzeiten unmittelbar vorher vermeiden – Umklapp-Positionen drücken auf den Magen",
        "Ausreichend hydratisieren, aber nicht literweise direkt vor der Praxis",
      ],
    },
    after: {
      window: "Nach der Einheit (ruhig angesetzt)",
      options: [
        "Leichte, eiweißreiche Kost: Gemüse-Omelett, Linsensuppe, Quark mit Nüssen",
        "Die Praxis senkt oft den Appetit kurzfristig – bewusst eine vollwertige Mahlzeit einplanen",
      ],
    },
    dietStyles: [
      { name: "Vegetarisch / Vegan", hint: "Passt gut zur pflanzlichen Kost; Hülsenfrüchte, Nüsse und Getreide liefern die Dichte." },
      { name: "Klassisch", hint: "Keine Einschränkungen; vor Morgenpraxis ggf. nur eine kleine Mahlzeit." },
    ],
    bodyNote:
      "Yoga, Tai Chi und Mobilitätstraining verbessern Bewegungsradius und Körperwahrnehmung. Als Ergänzung zu Kraft- und Ausdauertraining beugen sie Überlastung einseitiger Muster vor.",
  },
];
