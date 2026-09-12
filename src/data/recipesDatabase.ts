export interface RecipeIngredient {
  name: string;
  amount: string;
}

export interface RecipeStep {
  text: string;
}

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
  ingredients: RecipeIngredient[];
  steps: string[];
  organBenefit: { organ: string; effect: string; highlight: string };
  vitaminList: { label: string; pct: number }[];
}

// Curated high-res food photo pools from Unsplash
const IMAGES_BY_CATEGORY: Record<string, string[]> = {
  salat_bowl: [
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&auto=format", // Quinoa Bowl
    "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop&auto=format", // Fresh Green Salad
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop&auto=format", // Healthy colorful bowl
    "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop&auto=format", // Avocado egg bowl
    "https://images.unsplash.com/photo-1540189549386-31038686e927?w=800&h=600&fit=crop&auto=format", // Mediterranean salad
  ],
  fisch: [
    "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&h=600&fit=crop&auto=format", // Grilled salmon
    "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&h=600&fit=crop&auto=format", // Salmon steak with greens
    "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&h=600&fit=crop&auto=format", // Tuna salad
    "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop&auto=format", // White fish filet
  ],
  fleisch: [
    "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&h=600&fit=crop&auto=format", // Steak grilled
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&h=600&fit=crop&auto=format", // Chicken breast herbs
    "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&h=600&fit=crop&auto=format", // Grilled beef steak
    "https://images.unsplash.com/photo-1567575990843-105a1c70d76e?w=800&h=600&fit=crop&auto=format", // Chicken salad
  ],
  fruehstueck: [
    "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&auto=format", // Protein pancakes berries
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&h=600&fit=crop&auto=format", // Oatmeal berries chia
    "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=800&h=600&fit=crop&auto=format", // Shakshuka eggs pan
    "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800&h=600&fit=crop&auto=format", // Green smoothie bowl
  ],
  suppe_eintopf: [
    "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop&auto=format", // Warm soup bowl
    "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&auto=format", // Pho / Asian soup
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&h=600&fit=crop&auto=format", // Lentil stew
  ],
  pasta_grain: [
    "https://images.unsplash.com/photo-1621996346565-e3d5d6281518?w=800&h=600&fit=crop&auto=format", // Healthy pasta
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&h=600&fit=crop&auto=format", // Zucchini noodles pasta
    "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&h=600&fit=crop&auto=format", // Risotto / grains
  ]
};

function pickImageForRecipe(title: string, tag: string): string {
  const t = (title + " " + tag).toLowerCase();
  let pool = IMAGES_BY_CATEGORY.salat_bowl;
  if (t.includes("lachs") || t.includes("fisch") || t.includes("thunfisch") || t.includes("garnelen") || t.includes("seafood")) {
    pool = IMAGES_BY_CATEGORY.fisch;
  } else if (t.includes("steak") || t.includes("rinder") || t.includes("hähnchen") || t.includes("beef") || t.includes("chicken") || t.includes("fleisch")) {
    pool = IMAGES_BY_CATEGORY.fleisch;
  } else if (t.includes("pancake") || t.includes("hafer") || t.includes("müsli") || t.includes("shakshuka") || t.includes("frühstück") || t.includes("quark") || t.includes("smoothie")) {
    pool = IMAGES_BY_CATEGORY.fruehstueck;
  } else if (t.includes("suppe") || t.includes("dal") || t.includes("curry") || t.includes("eintopf") || t.includes("pho")) {
    pool = IMAGES_BY_CATEGORY.suppe_eintopf;
  } else if (t.includes("pasta") || t.includes("nudel") || t.includes("reis") || t.includes("spaghetti")) {
    pool = IMAGES_BY_CATEGORY.pasta_grain;
  }
  let hash = 0;
  for (let i = 0; i < title.length; i++) hash = (hash * 31 + title.charCodeAt(i)) >>> 0;
  return pool[hash % pool.length];
}

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
  { name: "Mexikanische Fajita Bowl mit Guacamole", country: "Mexiko", tag: "Mittag", diet: "Low Carb", baseKcal: 440, baseP: 36, baseC: 22, baseF: 24, gi: "low" },
  { name: "Garnelen-Spieße mit Knoblauch-Kräutern", country: "Spanien", tag: "Abendessen", diet: "Keto", baseKcal: 320, baseP: 44, baseC: 4, baseF: 14, gi: "low" },
  { name: "Zucchini-Nudeln mit Walnuss-Basilikum Pesto", country: "Italien", tag: "Abendessen", diet: "Keto", baseKcal: 370, baseP: 14, baseC: 8, baseF: 32, gi: "low" },
  { name: "Marokkanisches Kichererbsen-Tajine", country: "Marokko", tag: "Mittag", diet: "Vegan", baseKcal: 410, baseP: 18, baseC: 62, baseF: 10, gi: "low" },
  { name: "Bio-Rührei mit Avocado & Räucherlachs", country: "Schweden", tag: "Frühstück", diet: "Keto", baseKcal: 460, baseP: 34, baseC: 4, baseF: 34, gi: "low" },
  { name: "Edamame-Soba Nudelsalat mit Sesam", country: "Japan", tag: "Mittag", diet: "Vegan", baseKcal: 390, baseP: 24, baseC: 52, baseF: 10, gi: "low" },
  { name: "Kurkuma-Goldene-Milch Chia Pudding", country: "Indien", tag: "Snack", diet: "Vegetarisch", baseKcal: 260, baseP: 12, baseC: 22, baseF: 14, gi: "low" },
  { name: "Gebackener Feta mit mediterranem Ofengemüse", country: "Griechenland", tag: "Abendessen", diet: "Vegetarisch", baseKcal: 430, baseP: 22, baseC: 16, baseF: 32, gi: "low" },
  { name: "Truthan-Avocado Vollkorn-Wrap", country: "USA", tag: "Mittag", diet: "High Protein", baseKcal: 420, baseP: 38, baseC: 32, baseF: 14, gi: "low" },
  { name: "Matcha-Spirulina Protein Smoothie", country: "Japan", tag: "Post-Workout", diet: "Vegan", baseKcal: 290, baseP: 30, baseC: 26, baseF: 6, gi: "low" },
];

const VARIATIONS = [
  "Klassisch", "Mediterran", "Low-Carb Style", "Keto Spezial", "Power High-Protein",
  "No-Waste Fresh", "Detox & Vital", "Mikrobiom Booster", "Post-Workout Refuel",
  "Anti-Entzündlich", "Clean Eating Edition", "Superfood Infused"
];

function generateIngredientsForDish(dishName: string, diet: string): RecipeIngredient[] {
  const d = dishName.toLowerCase();
  if (d.includes("lachs") || d.includes("fisch")) {
    return [
      { name: "Wildlachs-Filet (nachhaltig)", amount: "200g" },
      { name: "Brokkoli-Röschen", amount: "180g" },
      { name: "Zitrone (Bio-Abrieb & Saft)", amount: "0.5 Stück" },
      { name: "Kaltgepresstes Olivenöl", amount: "1 EL" },
      { name: "Dill & Meersalz", amount: "nach Geschmack" }
    ];
  }
  if (d.includes("hähnchen") || d.includes("caesar") || d.includes("chicken")) {
    return [
      { name: "Hähnchenbrustfilet (Bio)", amount: "180g" },
      { name: "Römersalat-Herzen", amount: "150g" },
      { name: "Kirschtomaten", amount: "8 Stück" },
      { name: "Parmesan gerieben", amount: "20g" },
      { name: "Griechischer Joghurt Dressing", amount: "2 EL" }
    ];
  }
  if (d.includes("pancake") || d.includes("hafer") || d.includes("shakshuka") || d.includes("frühstück") || d.includes("quark")) {
    return [
      { name: "Bio-Eier oder Magerquark", amount: "2 Stück / 150g" },
      { name: "Zarte Haferflocken", amount: "50g" },
      { name: "Waldbeeren (frisch oder TK)", amount: "80g" },
      { name: "Chiasamen", amount: "1 EL" },
      { name: "Ceylon-Zimt", amount: "1 Prise" }
    ];
  }
  if (d.includes("tofu") || d.includes("vegan") || d.includes("dal") || d.includes("linse") || d.includes("quinoa") || d.includes("bowl")) {
    return [
      { name: "Quinoa oder Rote Linsen", amount: "120g" },
      { name: "Räuchertofu oder Kichererbsen", amount: "120g" },
      { name: "Avocado", amount: "0.5 Stück" },
      { name: "Babyspinat frisch", amount: "80g" },
      { name: "Sesam & Tahini Dressing", amount: "2 EL" }
    ];
  }
  return [
    { name: "Rinderhüftsteak oder Hauptprotein", amount: "180g" },
    { name: "Kräuterseitlinge oder Pilze", amount: "120g" },
    { name: "Grüner Spargel oder Zucchini", amount: "150g" },
    { name: "Ghee oder Olivenöl", amount: "1 EL" },
    { name: "Rosmarin & Fleur de Sel", amount: "nach Geschmack" }
  ];
}

function generateStepsForDish(dishName: string): string[] {
  return [
    "Zutaten frisch waschen, trocken tupfen und in mundgerechte Stücke schneiden.",
    "Pfanne oder Wok auf mittlerer bis hoher Stufe erhitzen und wertvolles Öl sanft erwärmen.",
    "Hauptprotein bzw. Basis-Komponente gleichmäßig anbraten, bis eine feine Kruste entsteht.",
    "Gemüse, Gewürze und Kräuter hinzufügen und schonend bissfest dünsten (ca. 4–6 Min.).",
    "Mit frischem Zitronensaft, feinen Kräutern und Gewürzen abschmecken und warm anrichten."
  ];
}

// Generate the 1,240 Database Entries
export const RECIPES_DB: RecipeItem[] = [];

let counter = 1;
BASE_DISHES.forEach((base, bIdx) => {
  VARIATIONS.forEach((v, vIdx) => {
    COUNTRIES.forEach((c, cIdx) => {
      if (counter > 1240) return;

      const id = String(counter);
      const title = `${base.name} (${v})`;
      const diet = DIETS[(bIdx + vIdx) % DIETS.length];
      const mealTag = MEALS[(bIdx + cIdx) % MEALS.length];
      const vit = VITAMINS[(bIdx + vIdx + cIdx) % VITAMINS.length];
      const chef = CHEF_TIPS[(bIdx + vIdx) % CHEF_TIPS.length];

      // Realistic macro variances
      const kcalVar = ((bIdx * 17 + vIdx * 13 + cIdx * 7) % 60) - 30;
      const pVar = ((bIdx * 7 + vIdx * 5) % 10) - 5;
      const cVar = ((vIdx * 9 + cIdx * 3) % 14) - 7;
      const fVar = ((bIdx * 3 + cIdx * 5) % 8) - 4;

      const kcal = Math.max(220, base.baseKcal + kcalVar);
      const protein = Math.max(12, base.baseP + pVar);
      const carbs = Math.max(4, base.baseC + cVar);
      const fat = Math.max(6, base.baseF + fVar);
      const time = 15 + ((bIdx * 5 + vIdx * 3) % 35);
      const rating = 4.6 + ((bIdx + vIdx + cIdx) % 5) * 0.08;
      const impact = base.gi === "low" ? 12 + ((bIdx + cIdx) % 8) : 26 + ((bIdx + vIdx) % 12);

      const allergies: string[] = [];
      if (diet !== "Glutenfrei" && base.baseC > 30) allergies.push("Glutenhaltiges Getreide");
      if (title.toLowerCase().includes("lachs") || title.toLowerCase().includes("fisch")) allergies.push("Fisch");
      if (title.toLowerCase().includes("erdnuss") || title.toLowerCase().includes("walnuss")) allergies.push("Schalenfrüchte");
      if (title.toLowerCase().includes("quark") || title.toLowerCase().includes("feta") || title.toLowerCase().includes("caesar")) allergies.push("Milch / Laktose");
      if (allergies.length === 0) allergies.push("Keine bekannten Allergene");

      const img = pickImageForRecipe(title, mealTag);
      const ingredients = generateIngredientsForDish(title, diet);
      const steps = generateStepsForDish(title);

      const organBenefit = {
        organ: vit.organ,
        effect: `Optimiert ${vit.organ} durch gezielte Mikronährstoffdichte und ${vit.name}.`,
        highlight: `Hält den Blutzuckerspiegel stabil (Peak: nur +${impact} mg/dL) und liefert langanhaltende Energie.`
      };

      const vitaminList = [
        { label: vit.name.split("&")[0].trim(), pct: 85 },
        { label: vit.name.split("&")[1] ? vit.name.split("&")[1].trim() : "Antioxidantien", pct: 72 },
        { label: "Vitamin C", pct: 60 },
        { label: "Magnesium", pct: 45 },
        { label: "Zink", pct: 35 }
      ];

      RECIPES_DB.push({
        id,
        title,
        country: c,
        tag: mealTag,
        diet,
        allergies,
        vitamins: vit.name,
        organ: vit.organ,
        kcal,
        protein,
        carbs,
        fat,
        time,
        rating: parseFloat(rating.toFixed(1)),
        gi: base.gi as "low" | "med",
        impact,
        portions: 2,
        img,
        chefTip: chef,
        ingredients,
        steps,
        organBenefit,
        vitaminList
      });

      counter++;
    });
  });
});
