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
          type="button"
          onClick={() => onSelectCategory(null)}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
            activeCategory === null
              ? 'bg-accent text-white shadow-soft'
              : 'bg-surface text-ink ring-1 ring-inset ring-border hover:ring-accent'
          }`}
        >
          Tout
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelectCategory(category.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
              activeCategory === category.id
                ? 'bg-accent text-white shadow-soft'
                : 'bg-surface text-ink ring-1 ring-inset ring-border hover:ring-accent'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
        <div className="-mx-4 flex gap-2 overflow-x-auto border-l-2 border-accent-light px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0 sm:pl-3">
          <button
            type="button"
            onClick={() => onSelectSubcategory(null)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
              activeSubcategory === null
                ? 'bg-ink text-white'
                : 'bg-bg text-muted hover:text-ink'
            }`}
          >
            Toutes
          </button>
          {currentCategory.subcategories.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => onSelectSubcategory(sub.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ${
                activeSubcategory === sub.id
                  ? 'bg-ink text-white'
                  : 'bg-bg text-muted hover:text-ink'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
