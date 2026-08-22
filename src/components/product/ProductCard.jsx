import { Plus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import ImagePlaceholder from '../common/ImagePlaceholder'

export default function ProductCard({ product, onOpenDetail }) {
  const addItem = useCartStore((state) => state.addItem)
  const hasSinglePrice = product.prices.length === 1

  function handleAddClick() {
    if (hasSinglePrice) {
      addItem(product, product.prices[0], 1)
    } else {
      onOpenDetail(product)
    }
  }

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
      <button
        type="button"
        onClick={() => onOpenDetail(product)}
        className="block aspect-square w-full overflow-hidden"
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <ImagePlaceholder />
        )}
      </button>

      <div className="flex flex-1 flex-col p-3.5">
        <button
          type="button"
          onClick={() => onOpenDetail(product)}
          className="line-clamp-2 text-left text-sm font-medium leading-snug text-ink hover:text-accent"
        >
          {product.name}
        </button>

        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="text-sm font-semibold text-price">
            {hasSinglePrice ? `${product.prices[0]} f` : `À partir de ${product.prices[0]} f`}
          </span>
          <button
            type="button"
            onClick={handleAddClick}
            aria-label={`Ajouter ${product.name} au panier`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white transition-colors hover:bg-accent-dark"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  )
}
