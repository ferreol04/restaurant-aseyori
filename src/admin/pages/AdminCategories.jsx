import { useEffect, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useAdminCatalogStore } from '../../store/adminCatalogStore'
import Skeleton from '../../components/common/Skeleton'
import ConfirmDialog from '../../components/common/ConfirmDialog'

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents (é → e, etc.)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminCategories() {
  const categories = useAdminCatalogStore((state) => state.categories)
  const loading = useAdminCatalogStore((state) => state.loading)
  const ensureLoaded = useAdminCatalogStore((state) => state.ensureLoaded)

  const [newCategoryName, setNewCategoryName] = useState('')
  const [newSubcategoryNames, setNewSubcategoryNames] = useState({})
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null) // { type: 'category' | 'subcategory', item }

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  async function handleAddCategory(e) {
    e.preventDefault()
    setError('')
    const name = newCategoryName.trim()
    if (!name) return

    const { error: insertError } = await supabase
      .from('categories')
      .insert({ id: slugify(name), name, sort_order: categories.length })

    if (insertError) {
      setError(insertError.message)
      return
    }
    setNewCategoryName('')
  }

  async function confirmDeleteCategory(category) {
    const { error: deleteError } = await supabase.from('categories').delete().eq('id', category.id)
    if (deleteError) setError(deleteError.message)
  }

  async function handleAddSubcategory(category, e) {
    e.preventDefault()
    setError('')
    const name = (newSubcategoryNames[category.id] ?? '').trim()
    if (!name) return

    const { error: insertError } = await supabase.from('subcategories').insert({
      id: slugify(name),
      category_id: category.id,
      name,
      sort_order: category.subcategories.length,
    })

    if (insertError) {
      setError(insertError.message)
      return
    }
    setNewSubcategoryNames((prev) => ({ ...prev, [category.id]: '' }))
  }

  async function confirmDeleteSubcategory(subcategory) {
    const { error: deleteError } = await supabase
      .from('subcategories')
      .delete()
      .eq('id', subcategory.id)
    if (deleteError) setError(deleteError.message)
  }

  async function handleConfirmDelete() {
    if (pendingDelete.type === 'category') {
      await confirmDeleteCategory(pendingDelete.item)
    } else {
      await confirmDeleteSubcategory(pendingDelete.item)
    }
    setPendingDelete(null)
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">Catégories</h2>

      <form onSubmit={handleAddCategory} className="mt-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Nouvelle catégorie…"
          className="w-full min-w-0 flex-1 rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light sm:w-64 sm:flex-none"
        />
        <button
          type="submit"
          className="flex shrink-0 items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          <Plus size={16} /> Ajouter
        </button>
      </form>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <div className="mt-3 flex gap-2">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-ink">{category.name}</h3>
                <button
                  type="button"
                  onClick={() => setPendingDelete({ type: 'category', item: category })}
                  aria-label="Supprimer la catégorie"
                  className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <ul className="mt-3 flex flex-wrap gap-2">
                {category.subcategories.map((sub) => (
                  <li
                    key={sub.id}
                    className="flex items-center gap-1.5 rounded-full bg-bg px-3 py-1.5 text-xs text-muted"
                  >
                    {sub.name}
                    <button
                      type="button"
                      onClick={() => setPendingDelete({ type: 'subcategory', item: sub })}
                      aria-label={`Supprimer ${sub.name}`}
                      className="hover:text-red-600"
                    >
                      <Trash2 size={12} />
                    </button>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={(e) => handleAddSubcategory(category, e)}
                className="mt-3 flex flex-wrap gap-2"
              >
                <input
                  type="text"
                  value={newSubcategoryNames[category.id] ?? ''}
                  onChange={(e) =>
                    setNewSubcategoryNames((prev) => ({ ...prev, [category.id]: e.target.value }))
                  }
                  placeholder="Nouvelle sous-catégorie…"
                  className="min-w-40 flex-1 rounded-lg border border-border bg-bg px-2.5 py-1.5 text-xs transition-colors focus:border-accent focus:bg-surface focus:outline-none sm:w-56 sm:flex-none"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full px-3 py-1.5 text-xs font-medium text-accent hover:bg-accent-light"
                >
                  Ajouter
                </button>
              </form>
            </div>
          ))}
        </div>
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={
            pendingDelete.type === 'category'
              ? `Supprimer la catégorie « ${pendingDelete.item.name} » ? Cela échouera si des produits l'utilisent encore.`
              : `Supprimer la sous-catégorie « ${pendingDelete.item.name} » ?`
          }
          onConfirm={handleConfirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
