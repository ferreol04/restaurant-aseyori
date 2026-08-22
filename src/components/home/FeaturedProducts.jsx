import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { FEATURED_PRODUCT_IDS } from '../../data/restaurantInfo'
import ProductCard from '../product/ProductCard'
import ProductModal from '../product/ProductModal'

export default function FeaturedProducts({ products }) {
  const [selectedProduct, setSelectedProduct] = useState(null)

  const featured = FEATURED_PRODUCT_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  if (featured.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-4 pt-8 pb-8 sm:px-6">
      <div className="flex items-end justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Sélection
          </span>
          <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
            Nos incontournables
          </h2>
        </div>
        <Link
          to="/menu"
          className="group hidden items-center gap-1.5 text-sm font-medium text-accent sm:flex"
        >
          Tout le menu
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} onOpenDetail={setSelectedProduct} />
        ))}
      </div>

      <Link to="/menu" className="mt-6 flex items-center gap-1.5 text-sm font-medium text-accent sm:hidden">
        Tout le menu <ArrowRight size={15} />
      </Link>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}
