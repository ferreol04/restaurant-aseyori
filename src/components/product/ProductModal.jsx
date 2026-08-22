import { useState } from 'react'
import { X, Minus, Plus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import ImagePlaceholder from '../common/ImagePlaceholder'
import ModalPortal from '../common/ModalPortal'

export default function ProductModal({ product, onClose }) {
  const addItem = useCartStore((state) => state.addItem)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const hasMultiplePrices = product.prices.length > 1
  const selectedPrice = product.prices[selectedIndex]
  // Chaque prix peut avoir sa propre description (ex : "Petite portion" vs
  // "Grande portion"). Sinon, on retombe sur la description générale.
  const displayedDescription = hasMultiplePrices
    ? product.priceDescriptions?.[selectedIndex] || product.description
    : product.description

  function handleAdd() {
    addItem(product, selectedPrice, quantity)
    onClose()
  }

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex transform-gpu items-center justify-center bg-ink/55 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-84 animate-[slide-up_0.25s_ease-out] overflow-hidden rounded-3xl bg-surface shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/95 text-ink shadow-soft hover:bg-surface"
          >
            <X size={16} />
          </button>
          {/* Même traitement d'image que ProductCard : carré, object-cover.
              max-h évite tout défilement sur les petits écrans (recadrage
              automatique via object-cover, sans déformation). */}
          <div className="aspect-square max-h-[36vh] w-full overflow-hidden rounded-t-3xl">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <ImagePlaceholder />
            )}
          </div>
        </div>

        <div className="p-4">
          <h2 className="font-display text-lg font-semibold text-ink">{product.name}</h2>
          {displayedDescription && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">
              {displayedDescription}
            </p>
          )}

          {hasMultiplePrices && (
            <div className="mt-3">
              <p className="text-sm font-medium text-ink">Choisissez un prix</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.prices.map((price, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      selectedIndex === index
                        ? 'bg-accent text-white shadow-soft'
                        : 'bg-bg text-ink ring-1 ring-inset ring-border hover:ring-accent'
                    }`}
                  >
                    {price} f
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-ink">Quantité</span>
            <div className="flex items-center gap-1 rounded-full bg-bg p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Diminuer la quantité"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface sm:h-7 sm:w-7"
              >
                <Minus size={15} />
              </button>
              <span className="w-7 text-center text-sm font-medium tabular-nums">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                aria-label="Augmenter la quantité"
                className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface sm:h-7 sm:w-7"
              >
                <Plus size={15} />
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            className="mt-4 flex w-full items-center justify-between rounded-full bg-accent py-2.5 pl-5 pr-2 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Ajouter au panier
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm tabular-nums">
              {selectedPrice * quantity} f
            </span>
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}
