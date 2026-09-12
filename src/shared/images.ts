const U = (id: string, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format`;

export const IMG = {
  heroBowl:       U("1512621776951-a57141f2eefd", 1200, 800),
  heroSalad:      U("1540420773420-3366772f4999", 1200, 800),
  heroPlate:      U("1490645935967-10de6ba17061", 1200, 800),

  buddhaBowl:     U("1512621776951-a57141f2eefd", 600, 400),
  caesarSalad:    U("1556386734-4227a180d19e", 600, 400),
  vegSalad:       U("1547592180-85f173990554", 600, 400),
  quinoaBowl:     U("1505253716362-afaea1d3d1af", 600, 400),
  ceramicBowl:    U("1543352634-a1c51d9f1fa7", 600, 400),
  assortedFood:   U("1567575990843-105a1c70d76e", 600, 400),
  blackBowl:      U("1511690656952-34342bb7c2f2", 600, 400),
  blueBowl:       U("1623428187969-5da2dcea5ebf", 600, 400),
  slicedVeg:      U("1568158879083-c42860933ed7", 600, 400),

  oatmeal:        U("1497888329096-51c27beff665", 600, 400),
  berryBowl:      U("1610441009633-b6ca9c6d4be2", 600, 400),
  smoothieBowl:   U("1654923064926-be7e64267a31", 600, 400),
  acaiBowl:       U("1590301157284-ab2f8707bdc1", 600, 400),
  pancakes:       U("1528207776546-365bb710ee93", 600, 400),
  shakshuka:      U("1590301157890-4810ed352733", 600, 400),

  fishPlate:      U("1665401015549-712c0dc5ef85", 600, 400),
  fishVeg:        U("1633760040841-1f708ce95c56", 600, 400),
  fishPlatter:    U("1716816211582-ef70b1cd2e70", 600, 400),
  steakPlate:     U("1544025162-d76694265947", 600, 400),
  tofuWok:        U("1546069901-ba9599a7e63c", 600, 400),
  tunaSalad:      U("1540189549386-31038686e927", 600, 400),
  chiaPudding:    U("1511690656952-34342bb7c2f2", 600, 400),

  quinoaSalad:    U("1505576633757-0ac1084af824", 600, 400),
};

export const RECIPES = [
  { id: "1", title: "Buddha Bowl Deluxe",           img: IMG.buddhaBowl,    kcal: 420, protein: 22, carbs: 58, fat: 14, time: 20, rating: 4.8, gi: "low",  tag: "Mittag",    impact: 28, portions: 2 },
  { id: "2", title: "Caesar Salat mit Hähnchen",    img: IMG.caesarSalad,   kcal: 350, protein: 34, carbs: 14, fat: 16, time: 15, rating: 4.7, gi: "low",  tag: "Mittag",    impact: 16, portions: 2 },
  { id: "3", title: "Quinoa-Avocado Energy Bowl",   img: IMG.quinoaBowl,    kcal: 380, protein: 16, carbs: 62, fat: 10, time: 25, rating: 4.7, gi: "low",  tag: "Mittag",    impact: 32, portions: 2 },
  { id: "4", title: "Haferbrei mit Waldbeeren",     img: IMG.oatmeal,       kcal: 340, protein: 14, carbs: 56, fat:  8, time: 10, rating: 4.9, gi: "med",  tag: "Frühstück", impact: 38, portions: 1 },
  { id: "5", title: "Grüne Detox Smoothie Bowl",    img: IMG.smoothieBowl,  kcal: 290, protein: 12, carbs: 50, fat:  7, time:  8, rating: 4.5, gi: "med",  tag: "Frühstück", impact: 34, portions: 1 },
  { id: "6", title: "Gegrilltes Wildlachsfilet",    img: IMG.fishVeg,       kcal: 480, protein: 44, carbs: 14, fat: 26, time: 25, rating: 4.9, gi: "low",  tag: "Abendessen",impact: 12, portions: 2 },
  { id: "7", title: "Knackiger Gemüsesalat",        img: IMG.vegSalad,      kcal: 210, protein:  8, carbs: 26, fat:  9, time: 12, rating: 4.4, gi: "low",  tag: "Snack",     impact: 14, portions: 1 },
  { id: "8", title: "Amazonas Açaí Power Bowl",     img: IMG.acaiBowl,      kcal: 330, protein: 12, carbs: 54, fat:  9, time: 10, rating: 4.6, gi: "med",  tag: "Frühstück", impact: 36, portions: 1 },
  { id: "9", title: "Mediterrane Meeresfrüchteplatte", img: IMG.fishPlatter, kcal: 510, protein: 48, carbs: 10, fat: 28, time: 35, rating: 4.8, gi: "low",  tag: "Abendessen",impact: 10, portions: 2 },
  { id:"10", title: "Bunte Süßkartoffel-Bowl",      img: IMG.ceramicBowl,   kcal: 440, protein: 20, carbs: 64, fat: 12, time: 22, rating: 4.5, gi: "med",  tag: "Mittag",    impact: 35, portions: 2 },
  { id:"11", title: "Frischer Rohkost-Teller",      img: IMG.slicedVeg,     kcal: 180, protein:  7, carbs: 24, fat:  5, time: 10, rating: 4.3, gi: "low",  tag: "Snack",     impact: 14, portions: 1 },
  { id:"12", title: "Zitronen-Kräuter Quinoa",      img: IMG.quinoaSalad,   kcal: 360, protein: 14, carbs: 56, fat: 11, time: 20, rating: 4.6, gi: "low",  tag: "Mittag",    impact: 29, portions: 2 },
  { id:"13", title: "High-Protein Quark-Pancakes",  img: IMG.pancakes,      kcal: 410, protein: 42, carbs: 38, fat:  7, time: 15, rating: 4.9, gi: "low",  tag: "Frühstück", impact: 22, portions: 1 },
  { id:"14", title: "Würzige Protein-Shakshuka",    img: IMG.shakshuka,     kcal: 360, protein: 26, carbs: 22, fat: 18, time: 20, rating: 4.8, gi: "low",  tag: "Frühstück", impact: 18, portions: 2 },
  { id:"15", title: "Knuspriger Tofu-Erdnuss Wok",  img: IMG.tofuWok,       kcal: 450, protein: 31, carbs: 42, fat: 19, time: 18, rating: 4.7, gi: "low",  tag: "Mittag",    impact: 24, portions: 2 },
  { id:"16", title: "Rinderhüftsteak mit Brokkoli", img: IMG.steakPlate,    kcal: 490, protein: 52, carbs: 12, fat: 24, time: 20, rating: 5.0, gi: "low",  tag: "Abendessen",impact: 11, portions: 1 },
  { id:"17", title: "Thunfisch-Kichererbsen Salat", img: IMG.tunaSalad,     kcal: 390, protein: 38, carbs: 32, fat: 11, time: 10, rating: 4.8, gi: "low",  tag: "Mittag",    impact: 19, portions: 2 },
  { id:"18", title: "Chia-Proteinpudding mit Nüssen",img: IMG.chiaPudding,   kcal: 260, protein: 19, carbs: 16, fat: 13, time:  5, rating: 4.7, gi: "low",  tag: "Snack",     impact: 15, portions: 1 },
];