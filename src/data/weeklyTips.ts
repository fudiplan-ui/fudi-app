/**
 * FUDI Wöchentliche Tipps – News Feed für Küche, Aufbewahrung & Geschmack.
 * 3 Tipps pro Woche, rotierend nach Kalenderwoche.
 */

export interface WeeklyTip {
  id: string;
  title: string;
  content: string;
  category: "aufbewahrung" | "zubereitung" | "geschmack" | "kueche" | "kuehlschrank" | "gerichte";
  image: string;
  weekOffset: number; // 0 = aktuelle Woche, 1 = nächste, etc.
}

export const WEEKLY_TIPS: WeeklyTip[] = [
  // Woche 0 (aktuelle)
  {
    id: "tip-001",
    title: "Avocado richtig aufbewahren – und vor dem Braunwerden schützen",
    content: "Eine aufgeschnittene Avocado mit Zitronensaft beträufeln, luftdicht verschließen und im Kühlschrank lagern. Der Kern im Fruchtfleisch lässt schützen nur die Stelle direkt unter ihm – der Rest braucht den Säureschutz. So bleibt sie bis zu 2 Tage frisch und grün.",
    category: "aufbewahrung",
    image: "https://images.unsplash.com/photo-1523048517271-2225ed5ac4ac?w=800&h=600&fit=crop&auto=format",
    weekOffset: 0,
  },
  {
    id: "tip-002",
    title: "Geschmack balancieren: Die 5 Grundgeschmäcker im Gleichgewicht",
    content: "Ein Gericht schmeckt erst rund, wenn süß, sauer, salzig, bitter und umami im Einklang sind. Zu viel Säure? Eine Prise Zucker oder Honig ausgleichen. Zu süß? Ein Spritzer Zitrone oder Essig hilft. Zu salzig? Eine rohe Kartoffel in der Suppe zieht überschüssiges Salz.",
    category: "geschmack",
    image: "https://images.unsplash.com/photo-1544075583-52702ab9f872?w=800&h=600&fit=crop&auto=format",
    weekOffset: 0,
  },
  {
    id: "tip-003",
    title: "Kühlschrank-Zonen: Was gehört wo hinein?",
    content: "Oberes Fach: Fertiggerichte, Käse, Joghurt (wärmster Bereich). Mittleres Fach: Milchprodukte, Eier. Unterstes Fach: Fleisch und Fisch (kältester Bereich, oben über der Schublade). Gemüseschublade: Obst und Gemüse getrennt, nicht waschen bevor es eingelagert wird.",
    category: "kuehlschrank",
    image: "https://images.unsplash.com/photo-1556911293-ba77e2757b4e?w=800&h=600&fit=crop&auto=format",
    weekOffset: 0,
  },
  // Woche 1
  {
    id: "tip-004",
    title: "Kräuter länger frisch halten – das Glas-Wasser-Prinzip",
    content: "Frische Kräuter wie Petersilie, Koriander oder Basilikum wie ein Blumenstrauß in ein Glas mit etwas Wasser stellen und locker mit einem Beutel abdecken. Im Kühlschrank (außer Basilikum – der mag es wärmer) halten sie sich so bis zu 2 Wochen statt 2-3 Tagen.",
    category: "aufbewahrung",
    image: "https://images.unsplash.com/photo-1596343732391-a18cdd5f11bd?w=800&h=600&fit=crop&auto=format",
    weekOffset: 1,
  },
  {
    id: "tip-005",
    title: "Umami entfalten: Der fünfte Geschmack versteht man erst beim Kochen",
    content: "Umami kommt durch Glutamat und Nukleotide – in Tomaten, Pilzen, Parmesan, Sojasauce oder gereiftem Käse. Ein Stück Parmesanrinde in der Suppe kochen oder getrocknete Pilze einweichen und das Wasser mitverwenden verleiht Gerichten Tiefe ohne zusätzliches Salz.",
    category: "geschmack",
    image: "https://images.unsplash.com/photo-1518599744567-28107151b66e?w=800&h=600&fit=crop&auto=format",
    weekOffset: 1,
  },
  {
    id: "tip-006",
    title: "Messerscharf kochen: Die richtige Schneidetechnik für Gemüse",
    content: "Die Klaue: Fingerspitzen nach innen gekrümmt, das Messer entlang der Fingerkuppen führen. So schneidet man sicher und gleichmäßig. Zwiebeln erst halbieren, Wurzelende dranlassen, dann streif- und quer schneiden – so entstehen gleichmäßige Würfel ohne dass die Zwiebel auseinanderfällt.",
    category: "zubereitung",
    image: "https://images.unsplash.com/photo-1585827666445-0e02323977dc?w=800&h=600&fit=crop&auto=format",
    weekOffset: 1,
  },
  // Woche 2
  {
    id: "tip-007",
    title: "Kartoffeln, Zwiebeln und Knoblauch nie im Kühlschrank lagern",
    content: "Kartoffeln, Zwiebeln und Knoblauch brauchen Dunkelheit, Kühle und Luftzirkulation – aber keinen Kühlschrank. Die Kälte verwandelt Kartoffelstärke in Zucker und macht sie süßlich und körnig. Ein dunkler Vorratsschrank oder eine Kartoffelkiste ist ideal.",
    category: "aufbewahrung",
    image: "https://images.unsplash.com/photo-1519537329808-70003766778e?w=800&h=600&fit=crop&auto=format",
    weekOffset: 2,
  },
  {
    id: "tip-008",
    title: "Fleisch zart machen: Salz, Säure und Zeit",
    content: "Fleisch 30-60 Minuten vor dem Braten salzen, damit das Salz in die Fasern zieht und Feuchtigkeit bindet. Eine Marinade mit Joghurt, Buttermilch oder Ananassaft (enthält Enzyme) macht zähe Stücke zart – aber nicht länger als 2 Stunden marinieren, sonst wird die Oberfläche matschig.",
    category: "zubereitung",
    image: "https://images.unsplash.com/photo-1529216977768-b9eb73f59153?w=800&h=600&fit=crop&auto=format",
    weekOffset: 2,
  },
  {
    id: "tip-009",
    title: "Resteverwertung: Vom Mittagessen zum Abendessen",
    content: "Gekochter Reis vom Mittag eignet sich perfekt für gebratenen Reis am Abend. Restliches Gemüse kann in eine Frittata oder Suppe wandern. Gekochte Kartoffeln werden kalt geschnitten zu Kartoffelsalat oder erwärmt zu Bratkartoffeln. So wird No-Waste einfach.",
    category: "gerichte",
    image: "https://images.unsplash.com/photo-1543349069-c099d90cb41a?w=800&h=600&fit=crop&auto=format",
    weekOffset: 2,
  },
];

/**
 * Gibt die 3 Tipps für die aktuelle Woche zurück (basierend auf Kalenderwoche).
 */
export function getTipsForWeek(weekOffset: number = 0): WeeklyTip[] {
  return WEEKLY_TIPS.filter((t) => t.weekOffset === weekOffset);
}

/**
 * Gibt einen zufälligen Tipp einer Kategorie zurück.
 */
export function getRandomTip(category?: WeeklyTip["category"]): WeeklyTip | undefined {
  const filtered = category
    ? WEEKLY_TIPS.filter((t) => t.category === category)
    : WEEKLY_TIPS;
  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}