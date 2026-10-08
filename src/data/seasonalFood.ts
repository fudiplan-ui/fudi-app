/**
 * Saisonküche: Ernte-Saison, Vitamine & NRV-Referenzwerte.
 *
 * RECHTSSICHERHEIT:
 * - Vitaminangaben beziehen sich auf NRV (Verordnung (EU) Nr. 1169/2011,
 *   Anhang XIII) bzw. Literaturwerte pro 100 g essbarer Anteil.
 * - KEINE Heilversprechen (Health-Claims-VO (EG) Nr. 1924/2006).
 * - Kein Ersatz für medizinische oder diätetische Beratung (Disclaimer in UI).
 */

export interface SeasonalFood {
  name: string;
  months: number[];
  region: string;
  nutrients: string[];
  note: string;
  recipeKeywords: string[];
}

export const SEASONAL_FOODS: SeasonalFood[] = [
  // ── Winter (Dez–Feb) ──
  {
    name: "Süße Orangen (Import)",
    months: [12, 1, 2],
    region: "Spanien (Valencia, Andalusien)",
    nutrients: ["Vitamin C: 53 mg/100 g ≈ 66 % NRV", "Folsäure: 30 µg/100 g ≈ 15 % NRV", "Kalium: 181 mg/100 g"],
    note: "Hochsaison im südlichen Spanien – volle Süße durch kühle Nächte; Haupternte Dez–Feb.",
    recipeKeywords: ["Orange", "Zitrus", "Citrus"],
  },
  {
    name: "Mandarinen",
    months: [11, 12, 1, 2, 3],
    region: "Spanien, Italien",
    nutrients: ["Vitamin C: 26 mg/100 g ≈ 33 % NRV", "Beta-Carotin: 150 µg/100 g"],
    note: "Leicht bekömmlich, klassische Winter- und Feiertagssaison.",
    recipeKeywords: ["Mandarine", "Zitrus"],
  },
  {
    name: "Grapefruit (rot/gelb)",
    months: [1, 2, 3, 4],
    region: "Spanien, Zypern",
    nutrients: ["Vitamin C: 36 mg/100 g ≈ 45 % NRV", "Ballaststoffe: 1,6 g/100 g"],
    note: "Ernte läuft von Januar bis Frühjahr; passt zu Salaten und Frühstück.",
    recipeKeywords: ["Grapefruit", "Zitrus"],
  },
  {
    name: "Grünkohl",
    months: [11, 12, 1, 2, 3],
    region: "Deutschland (frostverträglich)",
    nutrients: ["Vitamin C: 110 mg/100 g ≈ 138 % NRV", "Vitamin K: 817 µg/100 g", "Folsäure: 145 µg/100 g"],
    note: "Frost macht ihn milder; Ernte bis in den Frühling hinein.",
    recipeKeywords: ["Grünkohl", "Kohl"],
  },
  {
    name: "Wurzelgemüse (Möhren, Pastinaken, Sellerie)",
    months: [10, 11, 12, 1, 2, 3],
    region: "Deutschland, Niederlande",
    nutrients: ["Beta-Carotin (Möhren): 8285 µg/100 g", "Vitamin C (Sellerie): 12 mg/100 g"],
    note: "Eingelagert schmecken Wurzeln im Winter süßer; Suppen- und Ofengemüse-Zeit.",
    recipeKeywords: ["Möhren", "Pastinake", "Sellerie", "Suppe"],
  },
  {
    name: "Chicorée & Endiviensalat",
    months: [10, 11, 12, 1, 2],
    region: "Deutschland, Belgien",
    nutrients: ["Ballaststoffe: 3,1 g/100 g", "Vitamin K: 115 µg/100 g"],
    note: "Bitterstoffe entfalten sich im Winter; klassische Saison bis Februar.",
    recipeKeywords: ["Chicorée", "Salat"],
  },
  {
    name: "Rosenkohl",
    months: [10, 11, 12, 1, 2],
    region: "Deutschland, Niederlande",
    nutrients: ["Vitamin C: 85 mg/100 g ≈ 106 % NRV", "Vitamin K: 177 µg/100 g"],
    note: "Nach den ersten Frösten besonders süß; Spitzen-Qualität Nov–Feb.",
    recipeKeywords: ["Rosenkohl", "Kohl"],
  },
  {
    name: "Kiwi (grün)",
    months: [11, 12, 1, 2, 3],
    region: "Italien, Griechenland",
    nutrients: ["Vitamin C: 93 mg/100 g ≈ 116 % NRV", "Vitamin K: 40 µg/100 g"],
    note: "Mediterrane Winterernte; reift nach und bleibt knackig.",
    recipeKeywords: ["Kiwi", "Obst"],
  },

  // ── Frühling (Mär–Mai) ──
  {
    name: "Spargel (weiß/grün)",
    months: [3, 4, 5, 6],
    region: "Deutschland (Baden-Württemberg, Bayern)",
    nutrients: ["Folsäure: 142 µg/100 g ≈ 71 % NRV", "Vitamin K: 57 µg/100 g", "Kalium: 202 mg/100 g"],
    note: "Spargelsaison ab Mitte April (weiß bis Johannistag, 24.6.).",
    recipeKeywords: ["Spargel"],
  },
  {
    name: "Bärlauch",
    months: [3, 4, 5],
    region: "Deutschland, Österreich (Wald)",
    nutrients: ["Vitamin C: 35 mg/100 g ≈ 44 % NRV", "Protein: 2,4 g/100 g"],
    note: "Kurze Saison März–Mai; nur mit Vorsicht sammeln (Verwechslungsgefahr mit Maiglöckchen).",
    recipeKeywords: ["Bärlauch", "Kräuter"],
  },
  {
    name: "Radieschen",
    months: [4, 5, 6],
    region: "Deutschland (regional)",
    nutrients: ["Vitamin C: 25 mg/100 g ≈ 31 % NRV", "Folsäure: 29 µg/100 g"],
    note: "Schnellwachsend – erste Frühjahrsernte ab April.",
    recipeKeywords: ["Radieschen", "Salat"],
  },
  {
    name: "Spinat (frisch)",
    months: [4, 5, 6, 9, 10],
    region: "Deutschland, Italien",
    nutrients: ["Folsäure: 190 µg/100 g ≈ 95 % NRV", "Eisen: 2,7 mg/100 g", "Vitamin K: 483 µg/100 g"],
    note: "Frühjahrs- und Herbstkultur; junge Blätter sind milder.",
    recipeKeywords: ["Spinat", "Blattgemüse"],
  },
  {
    name: "Rhabarber",
    months: [4, 5, 6],
    region: "Deutschland",
    nutrients: ["Vitamin C: 8 mg/100 g", "Kalium: 288 mg/100 g"],
    note: "Klassische Saison ab April; nur Stängel essen (Blätter oxalsäurehaltig).",
    recipeKeywords: ["Rhabarber", "Kuchen"],
  },
  {
    name: "Frische Kräuter (Petersilie, Dill, Schnittlauch)",
    months: [4, 5, 6, 7, 8, 9],
    region: "Deutschland (regional, Fensterbank)",
    nutrients: ["Vitamin C (Petersilie): 133 mg/100 g ≈ 166 % NRV", "Vitamin K sehr hoch"],
    note: "Kräuter-Saisonstart ab April; Dill passt zu Frühjahrsgemüse und Fisch.",
    recipeKeywords: ["Kräuter", "Dill", "Petersilie"],
  },

  // ── Sommer (Jun–Aug) ──
  {
    name: "Tomaten (regional)",
    months: [6, 7, 8, 9],
    region: "Deutschland (Freiland), Italien",
    nutrients: ["Vitamin C: 24 mg/100 g ≈ 30 % NRV", "Lycopin: 3–5 mg/100 g (bei Verwendung von Fett gut aufnehmbar)"],
    note: "Wärmesommer-Ernte; am Strauch gereift hat mehr Aroma als Kühlhausware.",
    recipeKeywords: ["Tomate", "Sauce"],
  },
  {
    name: "Zucchini & Gurken",
    months: [6, 7, 8, 9],
    region: "Deutschland, Spanien",
    nutrients: ["Kalium (Gurke): 147 mg/100 g", "Vitamin C (Zucchini): 17 mg/100 g"],
    note: "Sehr wasserreich (Gurke ~95 % Wasser), Hochsaison Juli–August.",
    recipeKeywords: ["Zucchini", "Gurke"],
  },
  {
    name: "Paprika (rot/gelb)",
    months: [6, 7, 8, 9, 10],
    region: "Deutschland, Spanien, Ungarn",
    nutrients: ["Vitamin C (rote Paprika): 128 mg/100 g ≈ 160 % NRV", "Beta-Carotin: 435 µg/100 g"],
    note: "Vollreife Paprika hat mehr Vitamin C als grüne; Spitzenernte August.",
    recipeKeywords: ["Paprika", "Wok"],
  },
  {
    name: "Erdbeeren",
    months: [5, 6, 7],
    region: "Deutschland, Österreich",
    nutrients: ["Vitamin C: 59 mg/100 g ≈ 74 % NRV", "Folsäure: 24 µg/100 g"],
    note: "Klassische Saison Mai–Juli; regionale Freiland-Erdbeeren sind aromatischer.",
    recipeKeywords: ["Erdbeere", "Beeren", "Dessert"],
  },
  {
    name: "Himbeeren & Brombeeren",
    months: [6, 7, 8, 9],
    region: "Deutschland, Serbien",
    nutrients: ["Vitamin C (Himbeere): 26 mg/100 g", "Ballaststoffe: 6,7 g/100 g"],
    note: "Himbeere ab Juni, Brombeere oft erst ab August; frisch am besten genießen.",
    recipeKeywords: ["Himbeere", "Brombeere", "Beeren"],
  },
  {
    name: "Pfirsiche & Nektarinen",
    months: [6, 7, 8, 9],
    region: "Italien, Spanien, Frankreich",
    nutrients: ["Beta-Carotin: 326 µg/100 g", "Vitamin C: 9 mg/100 g"],
    note: "Mediterrane Haupternte Juli–September; am Baum gereift am süßesten.",
    recipeKeywords: ["Pfirsich", "Nektarine", "Obst"],
  },
  {
    name: "Mais (frisch)",
    months: [7, 8, 9],
    region: "Deutschland, Italien",
    nutrients: ["Ballaststoffe: 2,7 g/100 g", "Magnesium: 37 mg/100 g"],
    note: "Süße Maisernte nur wenige Tage nach dem Pflücken (Zucker wandelt sich in Stärke).",
    recipeKeywords: ["Mais", "Taco"],
  },

  // ── Herbst (Sep–Nov) ──
  {
    name: "Äpfel (Elstar, Boskoop, Braeburn)",
    months: [9, 10, 11, 12, 1, 2, 3],
    region: "Deutschland",
    nutrients: ["Vitamin C: 12 mg/100 g", "Ballaststoffe: 2,4 g/100 g (Pektin)"],
    note: "Ernte ab September; kühl gelagert hält die Sorte bis ins Frühjahr.",
    recipeKeywords: ["Apfel", "Kuchen"],
  },
  {
    name: "Kürbis (Hokkaido, Muskat)",
    months: [9, 10, 11, 12],
    region: "Deutschland, Österreich",
    nutrients: ["Beta-Carotin (Hokkaido): ca. 4000 µg/100 g", "Kalium: 450 mg/100 g"],
    note: "Ernte ab September; Hokkaido wird nach der Ernte in 1–2 Wochen süßer.",
    recipeKeywords: ["Kürbis", "Suppe"],
  },
  {
    name: "Champignons & Waldpilze",
    months: [8, 9, 10, 11],
    region: "Deutschland, Polen",
    nutrients: ["Eiweiß: 3,1 g/100 g", "Niacin (B3): 3,6 mg/100 g ≈ 23 % NRV"],
    note: "Waldpilze nur sicher bestimmen oder zertifiziert kaufen; Hochsaison Sep/Okt.",
    recipeKeywords: ["Pilz", "Champignon", "Pfifferling"],
  },
  {
    name: "Rote Bete",
    months: [8, 9, 10, 11, 12],
    region: "Deutschland, Niederlande",
    nutrients: ["Folsäure: 109 µg/100 g ≈ 55 % NRV", "Mangan: 0,3 mg/100 g"],
    note: "Ernte ab August, einlagern bis in den Winter; Ofengemüse- und Saft-Klassiker.",
    recipeKeywords: ["Rote Bete", "Salat"],
  },
  {
    name: "Birnen (Conference, Gute Luise)",
    months: [8, 9, 10, 11],
    region: "Deutschland, Belgien",
    nutrients: ["Ballaststoffe: 3,1 g/100 g", "Kalium: 135 mg/100 g"],
    note: "Viele Sorten werden erst nach der Lagerung voll aromatisch (Nachreifung).",
    recipeKeywords: ["Birne", "Kuchen"],
  },
  {
    name: "Granatapfel",
    months: [9, 10, 11, 12],
    region: "Spanien, Italien, Türkei",
    nutrients: ["Vitamin C: 10 mg/100 g", "Polyphenole in der Kernschale enthalten"],
    note: "Mediterrane Ernte ab September; Kerne (Arilli) essen, Saft kalt pressen.",
    recipeKeywords: ["Granatapfel", "Salat"],
  },
  {
    name: "Feigen",
    months: [8, 9, 10],
    region: "Italien, Griechenland, Türkei",
    nutrients: ["Ballaststoffe: 2,9 g/100 g", "Kalium: 232 mg/100 g"],
    note: "Zweite Ernte (Spätfeige) ab August; sehr empfindlich – am besten frisch genießen.",
    recipeKeywords: ["Feige", "Obst"],
  },
];

/** Saison-Lebensmittel für einen Monat (1–12). */
export function foodsForMonth(month: number): SeasonalFood[] {
  return SEASONAL_FOODS.filter((f) => f.months.includes(month));
}

/** Monatsnamen (deutsch). */
export const MONTH_NAMES = [
  "Januar", "Februar", "März", "April", "Mai", "Juni",
  "Juli", "August", "September", "Oktober", "November", "Dezember",
];
