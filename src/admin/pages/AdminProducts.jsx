import { useEffect, useMemo, useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { supabase, deleteProductImage } from '../../lib/supabase'
import { useAdminCatalogStore } from '../../store/adminCatalogStore'
import { usePagination } from '../../hooks/usePagination'
import ProductForm from '../components/ProductForm'
import Pagination from '../../components/common/Pagination'
import SearchBar from '../../components/common/SearchBar'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Skeleton from '../../components/common/Skeleton'

const PAGE_SIZE = 15

export default function AdminProducts() {
  const categories = useAdminCatalogStore((state) => state.categories)
  const products = useAdminCatalogStore((state) => state.products)
  const loading = useAdminCatalogStore((state) => state.loading)
  const ensureLoaded = useAdminCatalogStore((state) => state.ensureLoaded)

  const [editingProduct, setEditingProduct] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  function handleSearch(value) {
    setQuery(value)
    setPage(1)
  }

  async function confirmDelete() {
    await supabase.from('products').delete().eq('id', pendingDelete.id)
    if (pendingDelete.image_url) deleteProductImage(pendingDelete.image_url)
    setPendingDelete(null)
    // Le cache admin se met à jour automatiquement via l'abonnement Realtime.
    setPage(1)
  }

  function categoryName(id) {
    return categories.find((c) => c.id === id)?.name ?? id
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return products
    return products.filter((product) => product.name.toLowerCase().includes(normalizedQuery))
  }, [products, query])

  const { page: safePage, totalPages, pageItems } = usePagination(filteredProducts, page, PAGE_SIZE)

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold text-ink">
          Produits <span className="text-muted">({products.length})</span>
        </h2>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
        >
          <Plus size={16} /> Ajouter un produit
        </button>
      </div>

      <div className="mt-5 max-w-sm">
        <SearchBar value={query} onChange={handleSearch} placeholder="Rechercher un produit…" />
      </div>

      {loading ? (
        <div className="mt-6 space-y-3 sm:space-y-0">
          {/* Squelette mobile : cartes empilées */}
          <div className="space-y-3 sm:hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
                <Skeleton className="mt-2.5 h-3 w-20" />
                <Skeleton className="mt-2 h-3.5 w-16" />
              </div>
            ))}
          </div>
          {/* Squelette bureau : lignes de tableau */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-soft sm:block">
            <div className="divide-y divide-border">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="ml-auto h-4 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Aucun produit ne correspond à « {query} ».</p>
      ) : (
        <div className="mt-6">
          {/* Mobile : cartes empilées, plus lisibles qu'un tableau étroit
              obligé de défiler horizontalement. */}
          <div className="space-y-3 sm:hidden">
            {pageItems.map((product) => (
              <div key={product.id} className="rounded-2xl border border-border bg-surface p-4 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{product.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{categoryName(product.category_id)}</p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      aria-label="Modifier"
                      className="rounded-full p-2 text-muted hover:bg-accent-light hover:text-accent"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(product)}
                      aria-label="Supprimer"
                      className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-sm font-semibold text-price">{product.prices.join(' / ')} f</p>
              </div>
            ))}
            <div className="rounded-2xl border border-border bg-surface p-3 shadow-soft">
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} className="" />
            </div>
          </div>

          {/* Bureau : tableau classique. */}
          <div className="hidden overflow-hidden rounded-2xl border border-border bg-surface shadow-soft sm:block">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border text-xs uppercase tracking-wide text-muted">
                  <tr>
                    <th className="px-5 py-3">Produit</th>
                    <th className="px-5 py-3">Catégorie</th>
                    <th className="px-5 py-3">Prix</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {pageItems.map((product) => (
                    <tr key={product.id} className="transition-colors hover:bg-bg">
                      <td className="px-5 py-3.5 font-medium text-ink">{product.name}</td>
                      <td className="px-5 py-3.5 text-muted">{categoryName(product.category_id)}</td>
                      <td className="px-5 py-3.5 text-price">{product.prices.join(' / ')} f</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setEditingProduct(product)}
                            aria-label="Modifier"
                            className="rounded-full p-2 text-muted hover:bg-accent-light hover:text-accent"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingDelete(product)}
                            aria-label="Supprimer"
                            className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-border p-3">
              <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} className="" />
            </div>
          </div>
        </div>
      )}

      {(isCreating || editingProduct) && (
        <ProductForm
          product={editingProduct}
          categories={categories}
          onClose={() => {
            setIsCreating(false)
            setEditingProduct(null)
          }}
          onSaved={() => {
            const wasCreating = isCreating
            setIsCreating(false)
            setEditingProduct(null)
            // On ne revient à la page 1 que lors d'un ajout (pour voir le
            // nouveau produit) — une modification garde l'admin sur la page
            // où se trouve le produit édité.
            if (wasCreating) setPage(1)
          }}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          message={`Supprimer « ${pendingDelete.name} » du catalogue ? Cette action est définitive.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
