import { Check } from 'lucide-react'

export default function CategoryFilter({
  categories,
  activeCategory,
  activeSubcategory,
  onSelectCategory,
  onSelectSubcategory,
}) {
  const currentCategory = categories.find((c) => c.id === activeCategory)

  return (
    <div className="space-y-3">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <button
          // Bug WebKit constaté sur certains iPhone : changer uniquement la
          // classe (donc le background-color) d'un bouton déjà existant ne
          // se repeint pas de façon fiable, alors qu'insérer un nouvel
          // élément se repeint toujours correctement (confirmé avec la
          // coche). En incluant l'état actif dans la clé, on force React à
          // remplacer le bouton par un tout nouvel élément DOM à chaque
          // changement plutôt que de patcher sa classe en place.
          key={`all-${activeCategory === null}`}
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${
            activeCategory === null
              ? 'bg-accent text-white shadow-soft'
              : 'bg-surface text-ink ring-1 ring-inset ring-border hover:ring-accent'
          }`}
        >
          {activeCategory === null && <Check size={14} />}
          Tout
        </button>
        {categories.map((category) => (
          <button
            key={`${category.id}-${activeCategory === category.id}`}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === category.id
                ? 'bg-accent text-white shadow-soft'
                : 'bg-surface text-ink ring-1 ring-inset ring-border hover:ring-accent'
            }`}
          >
            {activeCategory === category.id && <Check size={14} />}
            {category.name}
          </button>
        ))}
      </div>

      {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto border-l-2 border-accent-light px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pl-3">
          <button
            key={`all-sub-${activeSubcategory === null}`}
            type="button"
            onClick={() => onSelectSubcategory(null)}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${
              activeSubcategory === null
                ? 'bg-ink text-white'
                : 'bg-bg text-muted hover:text-ink'
            }`}
          >
            {activeSubcategory === null && <Check size={12} />}
            Toutes
          </button>
          {currentCategory.subcategories.map((sub) => (
            <button
              key={`${sub.id}-${activeSubcategory === sub.id}`}
              type="button"
              onClick={() => onSelectSubcategory(sub.id)}
              className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium ${
                activeSubcategory === sub.id
                  ? 'bg-ink text-white'
                  : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              {activeSubcategory === sub.id && <Check size={12} />}
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
