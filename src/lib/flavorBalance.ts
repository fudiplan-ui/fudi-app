/**
 * FUDI Geschmacksbalance – kulinarisches Ausbalancier-Werkzeug.
 *
 * Nutzer können OPTIONAL Zutat, Sorte, Herkunft und Reifegrad angeben.
 * Daraus wird ein Geschmacksprofil (süß/sauer/salzig/bitter/umami/scharf,
 * 0–4) abgeleitet und mit Tipps zum Ausbalancieren ergänzt. Ist die Zutat
 * in der Saison-Datenbank enthalten, wird die Ernte-Saison eingeblendet.
 *
 * RECHTSSICHERHEIT: Rein kulinarisches Werkzeug – keine Ernährungs-,
 * Gesundheits- oder Nährwertaussagen. Keine Heilversprechen.
 */

export type TasteKey = "suess" | "sauer" | "salzig" | "bitter" | "umami" | "scharf";

export const TASTE_LABELS: Record<TasteKey, string> = {
  suess: "Süß",
  sauer: "Säuerlich",
  salzig: "Salzig",
  bitter: "Bitter",
  umami: "Umami (herzhaft)",
  scharf: "Schärfe",
};

export type FlavorProfile = Record<TasteKey, number>;

export interface FlavorVariety {
  match: string[];
  delta: Partial<FlavorProfile>;
  note?: string;
}

export interface IngredientFlavor {
  name: string;
  keywords: string[];
  profile: FlavorProfile;
  varieties?: FlavorVariety[];
  seasonNote?: string;
  balances: string[];
}

const P = (suess: number, sauer: number, salzig: number, bitter: number, umami: number, scharf: number): FlavorProfile =>
  ({ suess, sauer, salzig, bitter, umami, scharf });

export const INGREDIENT_FLAVORS: IngredientFlavor[] = [
  {
    name: "Orange (Süße)",
    keywords: ["orange", "orangen", "apfelsine"],
    profile: P(3, 2, 0, 1, 0, 0),
    varieties: [
      { match: ["blut"], delta: { bitter: 1, suess: -1 }, note: "Blutorangen bringen feine Bittere mit – weniger Süße, mehr Tiefe." },
      { match: ["valencia"], delta: { suess: 1 }, note: "Valencia ist die klassische Saftorange – ausgewogen süß-säuerlich." },
    ],
    seasonNote: "Hauptsaison Dezember bis März (Import aus Spanien/Italien).",
    balances: [
      "Säuerliche Orangen mit einer Prise Salz oder Zimt entschärfen.",
      "Mehr Süße durch Karamellisierung (Ofen) oder Kombination mit Sahne.",
      "Bittere Akzente passen zu dunkler Schokolade oder Rucola.",
    ],
  },
  {
    name: "Apfel",
    keywords: ["apfel", "äpfel"],
    profile: P(3, 2, 0, 0, 0, 0),
    varieties: [
      { match: ["boskoop"], delta: { sauer: 1 }, note: "Boskoop ist deutlich säuerlicher – ideal zum Backen." },
      { match: ["elstar"], delta: { sauer: -1 }, note: "Elstar ist süß-säuerlich ausgewogen und sehr vielseitig." },
      { match: ["braeburn"], delta: { suess: 1, sauer: 1 }, note: "Braeburn ist intensiv süß UND spritzig säuerlich." },
    ],
    seasonNote: "Ernte August bis Oktober; Lagergut (Elstar, Boskoop) bis ins Frühjahr.",
    balances: [
      "Säuerliche Äpfel mit Zimt, Honig oder Nüssen abrunden.",
      "Zu süße Äpfel durch Zitronensaft ausbalancieren.",
      "Apfel + Käse: salzige Kontraste heben die Frucht.",
    ],
  },
  {
    name: "Tomate",
    keywords: ["tomate", "tomaten"],
    profile: P(2, 2, 0, 1, 3, 0),
    varieties: [
      { match: ["strauch", "cherry", "cocktail"], delta: { suess: 1 }, note: "Cocktail-/Cherry-Tomaten sind konzentriert süßer." },
      { match: ["ochsenherz"], delta: { sauer: -1 }, note: "Fleischtomaten sind milder – weicher, weniger Säure." },
    ],
    seasonNote: "Freilandsaison Juni bis September; Gewächshaus ganzjährig.",
    balances: [
      "Säuerliche Tomaten: Prise Zucker oder langsame Karamellisierung aus dem Ofen.",
      "Wasserig-blass: Salz + hochwertiges Olivenöl + Basilikum beleben.",
      "Bittere grüne Teile großzügig entfernen – sie dominieren den Salat.",
    ],
  },
  {
    name: "Erdbeere",
    keywords: ["erdbeere", "erdbeeren"],
    profile: P(3, 2, 0, 0, 0, 0),
    seasonNote: "Saison Mai bis Juli; regionale Freilanderdbeeren sind aromatischer.",
    balances: [
      "Blasse Erdbeeren mit Balsamico-Creme oder Zitronenabrieb aufhellen.",
      "Sehr süße Erdbeeren brauchen Säure-Kontrast: Zitronensaft oder Joghurt.",
      "Schwarzer Pfeffer auf Erdbeeren ist ein klassischer Schärfe-Akzent.",
    ],
  },
  {
    name: "Zitrone",
    keywords: ["zitrone", "zitronen", "limone"],
    profile: P(0, 4, 0, 1, 0, 0),
    varieties: [
      { match: ["unbehandelt", "bio"], delta: { bitter: 1 }, note: "Bio-Zitronen haben essbare Schale – leicht bitter, aber aromatisch." },
    ],
    seasonNote: "Import ganzjährig; deutsche Gewächshausernte hauptsächlich im Winter.",
    balances: [
      "Reine Säure braucht Fett oder Süße als Träger: Olivenöl, Honig oder Sahne.",
      "Schale (Abrieb) gezielt nutzen – nicht die weiße Innenschicht (bitter).",
    ],
  },
  {
    name: "Paprika",
    keywords: ["paprika", "peperoni"],
    profile: P(2, 1, 0, 1, 0, 1),
    varieties: [
      { match: ["rot"], delta: { suess: 1, bitter: -1 }, note: "Rote Paprika ist süßer und weniger bitter als grüne." },
      { match: ["grün"], delta: { bitter: 1, suess: -1 }, note: "Grüne Paprika ist bitterer und herber." },
      { match: ["gelb"], delta: { suess: 1 }, note: "Gelbe Paprika ist mild-süßlich." },
    ],
    seasonNote: "Hauptsaison Juli bis September; Import ganzjährig.",
    balances: [
      "Herbe Paprika durch Rösten süßen – verkohlte Schale anschließend abziehen.",
      "Scharfe Sorten mit Joghurt, Käse oder Reis abmildern.",
    ],
  },
  {
    name: "Mango",
    keywords: ["mango", "mangos"],
    profile: P(4, 1, 0, 0, 0, 0),
    seasonNote: "Import ganzjährig (Peru, Brasilien, Indien) – Fruchtreife prüfen!",
    balances: [
      "Feste Mango mit Limette und Chili salzen – Schärfe hebt die Süße.",
      "Überreife Frucht zu Smoothie oder Chutney verarbeiten.",
    ],
  },
  {
    name: "Grünkohl",
    keywords: ["grünkohl", "kohl", "palmkohl"],
    profile: P(1, 1, 0, 3, 1, 0),
    seasonNote: "Ernte November bis März; nach Frost milder (Stärke → Zucker).",
    balances: [
      "Bittere durch Fett (Speck/Olivenöl) oder Säure (Essig, Apfel) ausbalancieren.",
      "Für Einsteiger: junge Blätter wählen oder kurz blanchieren.",
    ],
  },
  {
    name: "Rhabarber",
    keywords: ["rhabarber"],
    profile: P(1, 4, 0, 1, 0, 0),
    seasonNote: "Saison April bis Juni; nur die Stängel verwenden.",
    balances: [
      "Extrem säuerlich – braucht immer Süße: Zucker, Vanille oder Erdbeeren.",
      "Säure abmildern durch Backen mit Streuseln oder als Kompott.",
    ],
  },
  {
    name: "Kürbis (Hokkaido)",
    keywords: ["kürbis", "hokkaido", "muskatkürbis"],
    profile: P(2, 0, 0, 0, 2, 0),
    seasonNote: "Ernte September bis Dezember; Hokkaido wird nach der Ernte süßer.",
    balances: [
      "Nussige Süße mit Salzigem kombinieren: Feta, Chiliöl oder geröstete Kerne.",
      "Wässriger Geschmack: länger rösten oder reduzieren (Konzentration).",
    ],
  },
];

// ── Analyse-Logik ────────────────────────────────────────────────────────────

/** Saison-Daten als Lookup (Schlüsselwort-Treffer → Ernte-Hinweis). */
const SEASON_LOOKUP: { keys: string[]; text: string }[] = [
  { keys: ["orange", "mandarine", "grapefruit"], text: "Saison: Dezember bis März (Import Spanien/Italien)" },
  { keys: ["spargel"], text: "Saison: April bis Juni (bis Johannistag, 24.6.)" },
  { keys: ["grünkohl"], text: "Saison: November bis März – nach Frost milder" },
  { keys: ["erdbeere"], text: "Saison: Mai bis Juli" },
  { keys: ["rhabarber"], text: "Saison: April bis Juni" },
  { keys: ["kürbis", "hokkaido"], text: "Saison: September bis Dezember" },
  { keys: ["tomate"], text: "Saison (Freiland): Juni bis September" },
  { keys: ["paprika"], text: "Saison: Juli bis September" },
  { keys: ["mango"], text: "Ganzjähriger Import; Fruchtreife prüfen" },
];

/** Findet die passende Zutat zur freien Eingabe (Teilwort-Match, lowercase). */
export function findFlavorIngredient(input: string): IngredientFlavor | null {
  const q = input.trim().toLowerCase();
  if (!q) return null;
  let best: IngredientFlavor | null = null;
  let bestScore = 0;
  for (const f of INGREDIENT_FLAVORS) {
    for (const kw of f.keywords) {
      if (q.includes(kw) && kw.length > bestScore) {
        best = f;
        bestScore = kw.length;
      }
    }
  }
  return best;
}

export type Ripeness = "unreif" | "reif" | "sehr-reif" | "ueberreif" | "";

export interface FlavorAnalysisInput {
  ingredient?: string;
  variety?: string;
  origin?: string;
  ripeness?: Ripeness;
}

export interface FlavorAnalysis {
  matched: IngredientFlavor | null;
  profile: FlavorProfile;
  ripenessNote: string | null;
  varietyNote: string | null;
  seasonNote: string | null;
  tips: string[];
  dominant: string;
}

const clamp = (n: number) => Math.max(0, Math.min(4, n));

/** Vollständige Geschmacksanalyse mit Sorten-/Herkunfts-/Reife-Anpassung. */
export function analyzeFlavor(input: FlavorAnalysisInput): FlavorAnalysis {
  const matched = findFlavorIngredient(input.ingredient || "");
  const profile: FlavorProfile = matched
    ? { ...matched.profile }
    : { suess: 0, sauer: 0, salzig: 0, bitter: 0, umami: 0, scharf: 0 };

  let varietyNote: string | null = null;
  const varietyQ = (input.variety || "").toLowerCase();

  if (matched?.varieties) {
    for (const v of matched.varieties) {
      if (v.match.some((m) => varietyQ.includes(m))) {
        for (const [key, delta] of Object.entries(v.delta)) {
          profile[key as TasteKey] = clamp(profile[key as TasteKey] + (delta ?? 0));
        }
        if (v.note) varietyNote = v.note;
        break;
      }
    }
  }

  const ripeness = input.ripeness || "";
  let ripenessNote: string | null = null;
  if (ripeness === "sehr-reif" || ripeness === "ueberreif") {
    profile.suess = clamp(profile.suess + 1);
    profile.sauer = clamp(profile.sauer - 1);
    profile.bitter = clamp(profile.bitter - 1);
    ripenessNote =
      ripeness === "ueberreif"
        ? "Überreif: maximale Süße, wenig Säure – ideal für Smoothie oder Chutney."
        : "Sehr reif: konzentrierte Süße, zurückgenommene Säure.";
  } else if (ripeness === "unreif") {
    profile.sauer = clamp(profile.sauer + 1);
    profile.bitter = clamp(profile.bitter + 1);
    profile.suess = clamp(profile.suess - 1);
    ripenessNote = "Unreif: säuerlicher und herb – am besten kochen, einlegen oder abwarten.";
  }

  const originQ = (input.origin || "").toLowerCase();
  const sunnyRegions = ["spanien", "italien", "portugal", "valencia", "andalusien", "marokko", "süd"];
  const greenhouseRegions = ["gewächshaus", "holland", "niederlande"];
  if (matched && /orange|apfel|tomate|erdbeere|mango/.test(matched.keywords.join(" "))) {
    if (sunnyRegions.some((r) => originQ.includes(r))) {
      profile.suess = clamp(profile.suess + 1);
    } else if (greenhouseRegions.some((r) => originQ.includes(r))) {
      profile.suess = clamp(profile.suess - 1);
      profile.sauer = clamp(profile.sauer + 1);
    }
  }

  const tips = matched ? [...matched.balances] : [];
  if (profile.sauer >= 3) tips.push("Starke Säure: mit Süße (Honig/Zucker), Fett (Avocado/Sahne) oder Salz ausgleichen.");
  if (profile.bitter >= 3) tips.push("Starke Bittere: mit Süße, Röstaroma oder Salzigem (Speck/Käse) entschärfen.");
  if (profile.scharf >= 3) tips.push("Starke Schärfe: Fett/Milch (Joghurt, Kokos) oder Süße mildert sie.");
  if (profile.salzig >= 3) tips.push("Stark salzig: Säure (Zitrone/Essig) oder leichte Süße hebt das Gleichgewicht zurück.");
  if (profile.suess >= 4) tips.push("Sehr süß: Säure-Contrast (Zitrus/Essig) oder Bitteres (Rucola, Kakao) einstreuen.");
  if (profile.umami >= 3) tips.push("Viel Umami: frische Säure und Kräuter verhindern Schwere.");

  let seasonNote: string | null = null;
  const q = (input.ingredient || "").toLowerCase();
  for (const s of SEASON_LOOKUP) {
    if (s.keys.some((k) => q.includes(k))) {
      seasonNote = s.text;
      break;
    }
  }
  if (!seasonNote && matched?.seasonNote) seasonNote = matched.seasonNote;

  const entries = Object.entries(profile) as [TasteKey, number][];
  const dominantEntry = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const dominant = dominantEntry[1] === 0 ? "neutral" : TASTE_LABELS[dominantEntry[0]];

  return {
    matched,
    profile,
    ripenessNote,
    varietyNote,
    seasonNote,
    tips: tips.length > 0 ? tips : ["Ausgewogen – einfach mit Salz, Säure und Kräutern abschmecken."],
    dominant,
  };
}
