
export interface RecipeItem {
  id: string;
  title: string;
  country: string;
  tag: string;
  diet: string;
  allergies: string[];
  vitamins: string;
  organ: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  time: number;
  rating: number;
  gi: "low" | "med";
  impact: number;
  portions: number;
  img: string;
  chefTip: string;
}

const IMGS = [
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1567575990843-105a1c70d76e?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1540189549386-31038686e927?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1665401015549-712c0dc5ef85?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1633760040841-1f708ce95c56?w=600&h=400&fit=crop&auto=format",
  "https://images.unsplash.com/photo-1716816211582-ef70b1cd2e70?w=600&h=400&fit=crop&auto=format",
];

const COUNTRIES = [
  "Japan", "Italien", "Griechenland", "Mexiko", "Indien", "Thailand", "Vietnam",
  "Libanon", "Türkei", "Spanien", "Marokko", "Schweden", "Georgien", "Peru",
  "Frankreich", "Deutschland", "USA", "Äthiopien", "Korea", "Brasilien"
];

const DIETS = ["High Protein", "Low Carb", "Keto", "Vegan", "Vegetarisch", "Glutenfrei", "Paleo"];
const MEALS = ["Frühstück", "Mittag", "Abendessen", "Snack", "Pre-Workout", "Post-Workout"];

const VITAMINS = [
  { name: "B12 & Eisen", organ: "Herz & Blutbildung" },
  { name: "Omega-3 & Cholin", organ: "Gehirn & Nervensystem" },
  { name: "Vitamin C & Zink", organ: "Immunsystem & Haut" },
  { name: "Magnesium & Kalium", organ: "Muskulatur & Elektrolyte" },
  { name: "Sulforaphan & Antioxidantien", organ: "Leber & Detox" },
  { name: "Präbiotische Ballaststoffe", organ: "Darm & Mikrobiom" },
  { name: "D3, K2 & Calcium", organ: "Knochen & Zähne" }
];

const CHEF_TIPS = [
  "Maillard-Reaktion: Die Pfanne vor dem Einlegen rauchend heiß erhitzen und erst danach wenden, wenn sich eine goldbraune Kruste gebildet hat.",
  "Säure-Balance: Ein Spritzer frischer Zitronensaft oder Sherry-Essig hebt die Aromen besser hervor als zusätzliches Salz.",
  "Stärke-Emulgierung: 2 EL heißes stärkehaltiges Kochwasser mit kaltem Olivenöl montieren für samtige Bindung ohne Sahne.",
  "Gewürz-Rösten: Kreuzkümmel, Koriander und Pfeffer vor dem Mahlen trocken 60 Sekunden in der Pfanne anrösten.",
  "Ruhephase nach dem Garen: Eiweiße ziehen sich bei Hitze zusammen – Fleisch und Fisch 5 Minuten ruhen lassen, damit der Saft zirkuliert.",
  "Kräuter-Timing: Robuste Kräuter (Rosmarin, Thymian) von Beginn an mitgaren, zarte (Basilikum, Koriander, Minze) erst in der letzten Minute beigeben."
];

const BASE_DISHES = [
  { name: "Buddha Bowl Deluxe", country: "Japan", tag: "Mittag", diet: "Vegan", baseKcal: 420, baseP: 22, baseC: 58, baseF: 14, gi: "low" },
  { name: "Caesar Salat mit Gegrilltem Hähnchen", country: "USA", tag: "Mittag", diet: "High Protein", baseKcal: 380, baseP: 42, baseC: 12, baseF: 16, gi: "low" },
  { name: "Quinoa-Avocado Energy Bowl", country: "Peru", tag: "Mittag", diet: "Glutenfrei", baseKcal: 390, baseP: 18, baseC: 54, baseF: 14, gi: "low" },
  { name: "Haferbrei mit Waldbeeren & Chiasamen", country: "Schweden", tag: "Frühstück", diet: "Vegetarisch", baseKcal: 340, baseP: 16, baseC: 56, baseF: 8, gi: "med" },
  { name: "Gegrilltes Wildlachsfilet mit Brokkoli", country: "Schweden", tag: "Abendessen", diet: "Keto", baseKcal: 490, baseP: 46, baseC: 10, baseF: 28, gi: "low" },
  { name: "High-Protein Quark-Pancakes", country: "Deutschland", tag: "Frühstück", diet: "High Protein", baseKcal: 410, baseP: 42, baseC: 36, baseF: 7, gi: "low" },
  { name: "Würzige Protein-Shakshuka", country: "Libanon", tag: "Frühstück", diet: "Low Carb", baseKcal: 360, baseP: 28, baseC: 18, baseF: 18, gi: "low" },
  { name: "Knuspriger Tofu-Erdnuss Wok", country: "Thailand", tag: "Mittag", diet: "Vegan", baseKcal: 450, baseP: 32, baseC: 44, baseF: 18, gi: "low" },
  { name: "Rinderhüftsteak mit Kräuterseitlingen", country: "Frankreich", tag: "Abendessen", diet: "Paleo", baseKcal: 510, baseP: 54, baseC: 8, baseF: 26, gi: "low" },
  { name: "Thunfisch-Kichererbsen Salat", country: "Italien", tag: "Mittag", diet: "High Protein", baseKcal: 400, baseP: 40, baseC: 34, baseF: 12, gi: "low" },
  { name: "Griechischer Bauernsalat mit Wildkräutern", country: "Griechenland", tag: "Mittag", diet: "Vegetarisch", baseKcal: 330, baseP: 16, baseC: 14, baseF: 22, gi: "low" },
  { name: "Koreanisches Beef Bulgogi mit Kimchi", country: "Korea", tag: "Abendessen", diet: "High Protein", baseKcal: 480, baseP: 48, baseC: 24, baseF: 18, gi: "low" },
  { name: "Indisches Rotes Linsen-Dal mit Ingwer", country: "Indien", tag: "Mittag", diet: "Vegan", baseKcal: 380, baseP: 24, baseC: 56, baseF: 8, gi: "low" },
  { name: "Vietnamesische Pho Bo Kräuter-Rinderbrühe", country: "Vietnam", tag: "Abendessen", diet: "Glutenfrei", baseKcal: 390, baseP: 38, baseC: 38, baseF: 10, gi: "low" },
  { name: "Mexikanische Fajita Bowl mit Guacamole", country: "Mexiko", tag: "Mittag", diet: "Low Carb", baseKcal: 460, baseP: 36, baseC: 22, baseF: 24, gi: "low" },
  { name: "Marokkanische Kichererbsen-Gemüse-Tagine", country: "Marokko", tag: "Abendessen", diet: "Vegan", baseKcal: 370, baseP: 18, baseC: 52, baseF: 11, gi: "low" },
  { name: "Spanische Knoblauch-Garnelen (Gambas al Ajillo)", country: "Spanien", tag: "Abendessen", diet: "Keto", baseKcal: 390, baseP: 38, baseC: 4, baseF: 24, gi: "low" },
  { name: "Georgisches Lobio Bohnengericht im Tontopf", country: "Georgien", tag: "Mittag", diet: "Vegan", baseKcal: 410, baseP: 22, baseC: 54, baseF: 12, gi: "low" },
  { name: "Türkisches Menemen mit Paprika & Feta", country: "Türkei", tag: "Frühstück", diet: "Vegetarisch", baseKcal: 340, baseP: 22, baseC: 14, baseF: 20, gi: "low" },
  { name: "Äthiopisches Misir Wot mit Injera Fladen", country: "Äthiopien", tag: "Abendessen", diet: "Vegan", baseKcal: 420, baseP: 24, baseC: 62, baseF: 9, gi: "low" },
  { name: "Brasilianischer Moqueca Fischeintopf", country: "Brasilien", tag: "Abendessen", diet: "Paleo", baseKcal: 470, baseP: 42, baseC: 16, baseF: 25, gi: "low" }
];

export function generateRecipesDatabase(targetCount = 1240): RecipeItem[] {
  const result: RecipeItem[] = [];
  let currentId = 1;

  for (const base of BASE_DISHES) {
    const v = VITAMINS[currentId % VITAMINS.length];
    result.push({
      id: String(currentId),
      title: base.name,
      country: base.country,
      tag: base.tag,
      diet: base.diet,
      allergies: ["Glutenfrei", "Laktosefrei"].slice(0, (currentId % 2) + 1),
      vitamins: v.name,
      organ: v.organ,
      kcal: base.baseKcal,
      protein: base.baseP,
      carbs: base.baseC,
      fat: base.baseF,
      time: 15 + ((currentId * 3) % 25),
      rating: Number((4.6 + ((currentId % 5) * 0.08)).toFixed(1)),
      gi: base.gi as "low" | "med",
      impact: 12 + ((currentId * 4) % 24),
      portions: 2,
      img: IMGS[currentId % IMGS.length],
      chefTip: CHEF_TIPS[currentId % CHEF_TIPS.length]
    });
    currentId++;
  }

  const modifiers = [
    "mit Sesam & Limette", "mit gerösteten Nüssen", "auf Blattspinat & Knoblauch",
    "mit fermentiertem Kimchi", "mit Avocado & Koriander", "mit gebackenen Süßkartoffeln",
    "an Safran-Kräuter-Dressing", "mit Ingwer-Soja-Reduktion", "mit frischen Granatapfelkernen",
    "mit Trüffelöl & Meersalz", "mit gegrillten Zucchini & Pinienkernen", "mit Tahini & Kreuzkümmel",
    "an Zitrone & wildem Oregano", "mit Cashew-Pfeffer-Kruste", "mit geschmorten Schalotten"
  ];

  while (result.length < targetCount) {
    const country = COUNTRIES[result.length % COUNTRIES.length];
    const diet = DIETS[result.length % DIETS.length];
    const meal = MEALS[result.length % MEALS.length];
    const v = VITAMINS[result.length % VITAMINS.length];
    const baseDish = BASE_DISHES[result.length % BASE_DISHES.length];
    const mod = modifiers[result.length % modifiers.length];

    let p = 30 + ((result.length * 7) % 28);
    let c = 10 + ((result.length * 11) % 45);
    let f = 10 + ((result.length * 5) % 20);
    let giType: "low" | "med" = "low";

    if (diet === "Keto" || diet === "Low Carb") {
      c = 4 + (result.length % 12);
      f = 22 + (result.length % 16);
      p = 38 + (result.length % 22);
    } else if (diet === "High Protein") {
      p = 44 + (result.length % 20);
      c = 20 + (result.length % 30);
    } else if (diet === "Vegan") {
      p = 22 + (result.length % 16);
      c = 45 + (result.length % 30);
      f = 12 + (result.length % 10);
      if (c > 50) giType = "med";
    }

    const kcal = Math.round(p * 4.1 + c * 4.1 + f * 9.1);

    const allergiesList = [];
    if (result.length % 2 === 0) allergiesList.push("Glutenfrei");
    if (result.length % 3 === 0) allergiesList.push("Laktosefrei");
    if (result.length % 5 === 0) allergiesList.push("Nussfrei");
    if (result.length % 7 === 0) allergiesList.push("Histaminarm");

    result.push({
      id: String(currentId),
      title: `${country} ${baseDish.name.split(" ")[0]} ${mod}`,
      country,
      tag: meal,
      diet,
      allergies: allergiesList,
      vitamins: v.name,
      organ: v.organ,
      kcal,
      protein: p,
      carbs: c,
      fat: f,
      time: 10 + ((result.length * 5) % 35),
      rating: Number((4.5 + ((result.length % 6) * 0.1)).toFixed(1)),
      gi: giType,
      impact: Math.min(38, Math.max(9, Math.round(c * 0.45 - p * 0.15))),
      portions: (result.length % 3) + 1,
      img: IMGS[result.length % IMGS.length],
      chefTip: CHEF_TIPS[result.length % CHEF_TIPS.length]
    });

    currentId++;
  }

  return result;
}

export const RECIPES_DB: RecipeItem[] = generateRecipesDatabase(1240);
