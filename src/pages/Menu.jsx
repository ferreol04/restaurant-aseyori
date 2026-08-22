import { useMemo, useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { usePagination } from '../hooks/usePagination'
import { forcePageRepaint } from '../lib/forceRepaint'
import CategoryFilter from '../components/product/CategoryFilter'
import SearchBar from '../components/common/SearchBar'
import ProductCard from '../components/product/ProductCard'
import ProductModal from '../components/product/ProductModal'
import ProductCardSkeleton from '../components/product/ProductCardSkeleton'
import Pagination from '../components/common/Pagination'

const PAGE_SIZE = 12

export default function Menu() {
  const { categories, products, loading, error } = useCatalog()
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeSubcategory, setActiveSubcategory] = useState(null)
  const [query, setQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [page, setPage] = useState(1)

  function handleSelectCategory(categoryId) {
    setActiveCategory(categoryId)
    setActiveSubcategory(null)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    forcePageRepaint()
  }

  function handleSelectSubcategory(subcategoryId) {
    setActiveSubcategory(subcategoryId)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    forcePageRepaint()
  }

  function handleSearch(value) {
    setQuery(value)
    setPage(1)
  }

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return products.filter((product) => {
      if (activeCategory && product.category !== activeCategory) return false
      if (activeSubcategory && product.subcategory !== activeSubcategory) return false
      if (normalizedQuery && !product.name.toLowerCase().includes(normalizedQuery)) return false
      return true
    })
  }, [products, activeCategory, activeSubcategory, query])

  const { page: safePage, totalPages, pageItems } = usePagination(filteredProducts, page, PAGE_SIZE)

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center sm:px-6">
          <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Notre menu</h1>
        </div>
      </div>

      <div className="sticky top-14.25 z-30 border-b border-border bg-bg">
        <div className="mx-auto max-w-6xl space-y-4 px-4 py-3.5 sm:px-6">
          <SearchBar value={query} onChange={handleSearch} />
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            activeSubcategory={activeSubcategory}
            onSelectCategory={handleSelectCategory}
            onSelectSubcategory={handleSelectSubcategory}
          />
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        {loading && (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        )}

        {error && (
          <p className="mt-16 text-center text-sm text-red-600">
            Impossible de charger le menu pour le moment ({error}).
          </p>
        )}

        {!loading && !error && filteredProducts.length === 0 && (
          <p className="mt-16 text-center text-muted">Aucun produit ne correspond à votre recherche.</p>
        )}

        {!loading && !error && filteredProducts.length > 0 && (
          <>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {pageItems.map((product) => (
                <ProductCard key={product.id} product={product} onOpenDetail={setSelectedProduct} />
              ))}
            </div>
            <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  )
}
