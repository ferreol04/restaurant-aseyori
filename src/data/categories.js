// Catégories et sous-catégories du catalogue (cahier des charges §4.1)
export const CATEGORIES = [
  { id: 'petit-dejeuner', name: 'Petit Déjeuner' },
  { id: 'resistance', name: 'Résistance' },
  { id: 'grignotines', name: 'Les grignotines' },
  {
    id: 'boissons',
    name: 'Nos boissons',
    subcategories: [
      { id: 'aperitif', name: 'Apéritif' },
      { id: 'sobebra', name: 'Sobebra (bière)' },
      { id: 'eau', name: 'Eau' },
      { id: 'sucreries-canette', name: 'Sucreries en canette' },
      { id: 'boissons-energisantes', name: 'Boissons énergisantes' },
      { id: 'jus-naturel', name: 'Jus naturel' },
    ],
  },
  { id: 'dessert', name: 'Dessert' },
]

export function getCategoryName(categoryId) {
  return CATEGORIES.find((c) => c.id === categoryId)?.name ?? categoryId
}

export function getSubcategoryName(categoryId, subcategoryId) {
  const category = CATEGORIES.find((c) => c.id === categoryId)
  return category?.subcategories?.find((s) => s.id === subcategoryId)?.name ?? subcategoryId
}
