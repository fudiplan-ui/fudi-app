const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const IMG = {
  // Hero / large
  heroBowl:       U("1512621776951-a57141f2eefd", 1200, 800),
  heroSalad:      U("1540420773420-3366772f4999", 1200, 800),
  heroPlate:      U("1490645935967-10de6ba17061", 1200, 800),

  // Recipes
  buddhaBowl:     U("1512621776951-a57141f2eefd", 600, 400),
  caesarSalad:    U("1556386734-4227a180d19e", 600, 400),
  vegSalad:       U("1547592180-85f173990554", 600, 400),
  quinoaBowl:     U("1505253716362-afaea1d3d1af", 600, 400),
  ceramicBowl:    U("1543352634-a1c51d9f1fa7", 600, 400),
  assortedFood:   U("1567575990843-105a1c70d76e", 600, 400),
  blackBowl:      U("1511690656952-34342bb7c2f2", 600, 400),
  blueBowl:       U("1623428187969-5da2dcea5ebf", 600, 400),
  slicedVeg:      U("1568158879083-c42860933ed7", 600, 400),

  // Breakfast
  oatmeal:        U("1497888329096-51c27beff665", 600, 400),
  berryBowl:      U("1610441009633-b6ca9c6d4be2", 600, 400),
  smoothieBowl:   U("1654923064926-be7e64267a31", 600, 400),
  acaiBowl:       U("1590301157284-ab2f8707bdc1", 600, 400),

  // Dinner
  fishPlate:      U("1665401015549-712c0dc5ef85", 600, 400),
  fishVeg:        U("1633760040841-1f708ce95c56", 600, 400),
  fishPlatter:    U("1716816211582-ef70b1cd2e70", 600, 400),

  // Other
  quinoaSalad:    U("1505576633757-0ac1084af824", 600, 400),
};

// Recipe catalogue used across pages
export const RECIPES = [
  { id: "1", title: "Buddha Bowl",         img: IMG.buddhaBowl,    kcal: 420, protein: 22, carbs: 58, fat: 14, time: 20, rating: 4.8, gi: "low",  tag: "Mittag",    impact: 28, portions: 2 },
  { id: "2", title: "Caesar Salat",        img: IMG.caesarSalad,   kcal: 310, protein: 18, carbs: 22, fat: 18, time: 15, rating: 4.6, gi: "low",  tag: "Mittag",    impact: 18, portions: 2 },
  { id: "3", title: "Quinoa Bowl",         img: IMG.quinoaBowl,    kcal: 380, protein: 16, carbs: 62, fat: 10, time: 25, rating: 4.7, gi: "low",  tag: "Mittag",    impact: 32, portions: 2 },
  { id: "4", title: "Haferbrei mit Beeren",img: IMG.oatmeal,       kcal: 340, protein: 12, carbs: 58, fat:  8, time: 10, rating: 4.9, gi: "med",  tag: "Frühstück", impact: 42, portions: 1 },
  { id: "5", title: "Smoothie Bowl",       img: IMG.smoothieBowl,  kcal: 290, protein:  9, carbs: 52, fat:  7, time:  8, rating: 4.5, gi: "med",  tag: "Frühstück", impact: 38, portions: 1 },
  { id: "6", title: "Gegrillter Fisch",   img: IMG.fishVeg,       kcal: 460, protein: 42, carbs: 18, fat: 22, time: 30, rating: 4.7, gi: "low",  tag: "Abendessen",impact: 15, portions: 2 },
  { id: "7", title: "Gemüsesalat",        img: IMG.vegSalad,      kcal: 210, protein:  8, carbs: 28, fat:  9, time: 12, rating: 4.4, gi: "low",  tag: "Snack",     impact: 14, portions: 1 },
  { id: "8", title: "Acai Bowl",          img: IMG.acaiBowl,      kcal: 320, protein: 11, carbs: 55, fat:  8, time: 10, rating: 4.6, gi: "med",  tag: "Frühstück", impact: 40, portions: 1 },
  { id: "9", title: "Fischplatte",        img: IMG.fishPlatter,   kcal: 510, protein: 46, carbs: 12, fat: 28, time: 35, rating: 4.8, gi: "low",  tag: "Abendessen",impact: 12, portions: 2 },
  { id:"10", title: "Ceramic Bowl Mix",   img: IMG.ceramicBowl,   kcal: 440, protein: 20, carbs: 64, fat: 12, time: 22, rating: 4.5, gi: "med",  tag: "Mittag",    impact: 35, portions: 2 },
  { id:"11", title: "Bunter Gemüseteller",img: IMG.slicedVeg,     kcal: 180, protein:  7, carbs: 26, fat:  5, time: 10, rating: 4.3, gi: "low",  tag: "Snack",     impact: 16, portions: 1 },
  { id:"12", title: "Quinoa Salat",       img: IMG.quinoaSalad,   kcal: 360, protein: 14, carbs: 56, fat: 11, time: 20, rating: 4.6, gi: "low",  tag: "Mittag",    impact: 29, portions: 2 },
];
