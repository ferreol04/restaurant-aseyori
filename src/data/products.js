// Catalogue transcrit depuis les menus du restaurant.
// `prices` est toujours un tableau : un seul élément = prix unique (ajout direct au panier),
// plusieurs éléments = le client choisit dans le modal de détail (cahier des charges §3.2/§4).
// `image` est laissé vide en attendant les vraies photos produits.

export const PRODUCTS = [
  // --- Petit Déjeuner ---
  { id: 'cafe-au-lait-chaud', category: 'petit-dejeuner', name: 'Café au lait chaud', description: '', image: '', prices: [250] },
  { id: 'cafe-au-lait-froid', category: 'petit-dejeuner', name: 'Café au lait froid', description: '', image: '', prices: [300] },
  { id: 'lait-peak-cafe-chaud', category: 'petit-dejeuner', name: 'Lait peak au café chaud', description: '', image: '', prices: [700] },
  { id: 'lait-peak-cafe-froid', category: 'petit-dejeuner', name: 'Lait peak au café froid', description: '', image: '', prices: [800] },
  { id: 'lipton', category: 'petit-dejeuner', name: 'Lipton', description: '', image: '', prices: [150] },
  { id: 'omelette', category: 'petit-dejeuner', name: 'Omelette', description: '', image: '', prices: [500] },
  { id: 'alloco-omelette', category: 'petit-dejeuner', name: 'Alloco + omelette', description: '', image: '', prices: [600] },
  { id: 'indomie', category: 'petit-dejeuner', name: 'Indomie', description: 'Portion simple ou double.', image: '', prices: [500, 800] },
  { id: 'spaghettis', category: 'petit-dejeuner', name: 'Spaghettis', description: 'Petite, moyenne ou grande portion.', image: '', prices: [500, 1000, 1500] },
  { id: 'coquillettes', category: 'petit-dejeuner', name: 'Coquillettes', description: 'Petite ou grande portion.', image: '', prices: [500, 1000] },
  { id: 'sandwich-viande-hachee', category: 'petit-dejeuner', name: 'Sandwich viande hachée', description: '', image: '', prices: [1500] },
  { id: 'chawarma', category: 'petit-dejeuner', name: 'Chawarma', description: 'Petite, moyenne ou grande taille.', image: '', prices: [1000, 1500, 2000] },
  { id: 'frite-au-poulet', category: 'petit-dejeuner', name: 'Frite au poulet', description: 'Petite ou grande portion.', image: '', prices: [1500, 2000] },
  { id: 'salade', category: 'petit-dejeuner', name: 'Salade', description: 'Petite, moyenne ou grande portion.', image: '', prices: [1200, 1500, 2000] },

  // --- Résistance ---
  { id: 'riz-gras-creole-frite-aloco', category: 'resistance', name: 'Riz gras/créole + frite/aloco', description: '', image: '', prices: [2000] },
  { id: 'riz-blanc-sauce-gesier-poulet', category: 'resistance', name: 'Riz blanc + sauce gésier/poulet', description: 'Portion gésier ou poulet.', image: '', prices: [1500, 2000] },
  { id: 'couscous', category: 'resistance', name: 'Couscous', description: 'Petite, moyenne ou grande portion.', image: '', prices: [1000, 1500, 2000] },
  { id: 'attieke', category: 'resistance', name: 'Attiéké', description: 'Petite, moyenne ou grande portion.', image: '', prices: [1000, 1500, 2000] },
  { id: 'piron-rouge', category: 'resistance', name: 'Piron rouge', description: 'Petite ou grande portion.', image: '', prices: [1200, 2000] },
  { id: 'sauce-legume-blanc-pate', category: 'resistance', name: 'Sauce légume blanc (gboman/tchayo/amanvivê) + pâte au choix', description: '', image: '', prices: [3000] },
  { id: 'sauce-gluante-crincrin-gombo-pate', category: 'resistance', name: 'Sauce gluante crincrin/gombo + pâte au choix', description: '', image: '', prices: [2500] },
  { id: 'akassa-monyo-jus-oignons', category: 'resistance', name: 'Akassa + monyo/jus d’oignons', description: 'Petite ou grande portion.', image: '', prices: [1500, 2000] },

  // --- Les grignotines ---
  { id: 'croissant', category: 'grignotines', name: 'Croissant', description: 'Petit ou grand format.', image: '', prices: [300, 400] },
  { id: 'cake', category: 'grignotines', name: 'Cake', description: 'Petite part ou cake entier.', image: '', prices: [100, 500] },
  { id: 'biscuits-au-choix', category: 'grignotines', name: 'Biscuits au choix', description: 'À partir de 100 f selon le choix.', image: '', prices: [100] },
  { id: 'arachide', category: 'grignotines', name: 'Arachide', description: '', image: '', prices: [100] },

  // --- Nos boissons / Apéritif ---
  { id: 'aperitif-sodabi-amansidji', category: 'boissons', subcategory: 'aperitif', name: 'Apéritif (sodabi, amansidji)', description: 'Petit ou grand format.', image: '', prices: [100, 200] },

  // --- Nos boissons / Sobebra (bière) ---
  { id: 'beninoise', category: 'boissons', subcategory: 'sobebra', name: 'Béninoise', description: 'Petit ou grand format.', image: '', prices: [350, 600] },
  { id: 'doppel', category: 'boissons', subcategory: 'sobebra', name: 'Doppel', description: '', image: '', prices: [650] },
  { id: 'beaufort', category: 'boissons', subcategory: 'sobebra', name: 'Beaufort', description: '', image: '', prices: [600] },
  { id: 'guiness', category: 'boissons', subcategory: 'sobebra', name: 'Guiness', description: '', image: '', prices: [800] },
  { id: 'flag', category: 'boissons', subcategory: 'sobebra', name: 'Flag', description: '', image: '', prices: [700] },
  { id: 'pils', category: 'boissons', subcategory: 'sobebra', name: 'Pils', description: '', image: '', prices: [700] },
  { id: 'eku', category: 'boissons', subcategory: 'sobebra', name: 'Eku', description: '', image: '', prices: [600] },
  { id: 'hagbe-panache', category: 'boissons', subcategory: 'sobebra', name: 'Hagbê (Panache)', description: '', image: '', prices: [600] },
  { id: 'chill', category: 'boissons', subcategory: 'sobebra', name: 'Chill', description: 'Petit ou grand format.', image: '', prices: [350, 600] },
  { id: 'tequila', category: 'boissons', subcategory: 'sobebra', name: 'Tequila', description: '', image: '', prices: [500] },
  { id: 'youki-pamplemousse', category: 'boissons', subcategory: 'sobebra', name: 'Youki pamplemousse', description: 'Petit ou grand format.', image: '', prices: [400, 1000] },
  { id: 'youki-cocktails', category: 'boissons', subcategory: 'sobebra', name: 'Youki cocktails', description: 'Petit ou grand format.', image: '', prices: [400, 1000] },
  { id: 'youki-moka', category: 'boissons', subcategory: 'sobebra', name: 'Youki moka', description: '', image: '', prices: [400] },

  // --- Nos boissons / Eau ---
  { id: 'contesse', category: 'boissons', subcategory: 'eau', name: 'Contesse', description: '', image: '', prices: [600] },
  { id: 'fifa', category: 'boissons', subcategory: 'eau', name: 'FIFA', description: '', image: '', prices: [500] },
  { id: 'possotome-gazeifie', category: 'boissons', subcategory: 'eau', name: 'Possotome gazéifié', description: '', image: '', prices: [500] },

  // --- Nos boissons / Sucreries en canette ---
  { id: 'coca', category: 'boissons', subcategory: 'sucreries-canette', name: 'Coca', description: '', image: '', prices: [400] },
  { id: 'fanta', category: 'boissons', subcategory: 'sucreries-canette', name: 'Fanta', description: '', image: '', prices: [400] },
  { id: 'sprite', category: 'boissons', subcategory: 'sucreries-canette', name: 'Sprite', description: '', image: '', prices: [400] },
  { id: 'malta-guiness', category: 'boissons', subcategory: 'sucreries-canette', name: 'Malta guiness', description: '', image: '', prices: [500] },
  { id: 'desperados', category: 'boissons', subcategory: 'sucreries-canette', name: 'Desperados', description: '', image: '', prices: [500] },
  { id: 'budweiser', category: 'boissons', subcategory: 'sucreries-canette', name: 'Budweiser', description: '', image: '', prices: [500] },

  // --- Nos boissons / Boissons énergisantes ---
  { id: 'xxl', category: 'boissons', subcategory: 'boissons-energisantes', name: 'XXL', description: '', image: '', prices: [600] },
  { id: 'vody', category: 'boissons', subcategory: 'boissons-energisantes', name: 'Vody', description: '', image: '', prices: [700] },
  { id: 'sangria', category: 'boissons', subcategory: 'boissons-energisantes', name: 'Sangria', description: '', image: '', prices: [400] },
  { id: 'chateau-de-france', category: 'boissons', subcategory: 'boissons-energisantes', name: 'Château de France', description: '', image: '', prices: [400] },

  // --- Nos boissons / Jus naturel ---
  { id: 'jus-ananas', category: 'boissons', subcategory: 'jus-naturel', name: 'Jus d’ananas', description: 'Petit ou grand format.', image: '', prices: [500, 1000] },
  { id: 'jus-bissap', category: 'boissons', subcategory: 'jus-naturel', name: 'Jus de bissap', description: 'Petit ou grand format.', image: '', prices: [500, 1000] },

  // --- Dessert ---
  { id: 'degue-sorgho-couscous', category: 'dessert', name: 'Dêguê sorgho/couscous', description: 'Petite ou grande portion.', image: '', prices: [300, 500] },
  { id: 'degue-arachide', category: 'dessert', name: 'Dêguê + arachide', description: '', image: '', prices: [700] },
  { id: 'degue-coco-rape', category: 'dessert', name: 'Dêguê + coco rapé', description: '', image: '', prices: [700] },
  { id: 'lait-caille', category: 'dessert', name: 'Lait caillé', description: '', image: '', prices: [500] },
  { id: 'lait-caille-lait-concentre', category: 'dessert', name: 'Lait caillé + lait concentré', description: '', image: '', prices: [600] },
  { id: 'yaourt-simple', category: 'dessert', name: 'Yaourt simple', description: '', image: '', prices: [500] },
  { id: 'yaourt-menthe', category: 'dessert', name: 'Yaourt à la menthe', description: '', image: '', prices: [1000] },
  { id: 'yaourt-coco', category: 'dessert', name: 'Yaourt coco', description: '', image: '', prices: [1000] },
  { id: 'yaourt-chocolat', category: 'dessert', name: 'Yaourt au chocolat', description: '', image: '', prices: [1000] },
]
