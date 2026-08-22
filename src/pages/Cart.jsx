import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import OrderTunnel from '../components/cart/OrderTunnel'
import ImagePlaceholder from '../components/common/ImagePlaceholder'

export default function Cart() {
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const [isOrdering, setIsOrdering] = useState(false)

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-accent">
          <ShoppingBag size={26} />
        </span>
        <h1 className="mt-6 font-display text-2xl font-semibold text-ink">
          Votre panier est vide
        </h1>
        <p className="mt-2 text-sm text-muted">
          Parcourez le menu et ajoutez vos plats préférés pour commencer une commande.
        </p>
        <Link
          to="/menu"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-dark"
        >
          Voir le menu
          <ArrowRight size={17} />
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-semibold text-ink">Votre panier</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="space-y-3">
          {items.map((item) => (
            <li
              key={item.lineId}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-3 sm:flex-row sm:items-center sm:gap-4"
            >
              {/* Ligne 1 (mobile) : image + nom + suppression. À partir de
                  sm, `contents` efface ce conteneur pour que ses enfants
                  rejoignent directement la ligne unique du bureau. */}
              <div className="flex items-center gap-3 sm:contents">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl sm:h-16 sm:w-16">
                  {item.image ? (
                    <img src={item.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <ImagePlaceholder />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-ink">{item.name}</p>
                  <p className="text-sm text-price">{item.price} f</p>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.lineId)}
                  aria-label="Retirer du panier"
                  className="rounded-full p-2.5 text-muted hover:bg-bg hover:text-red-600 sm:order-last sm:p-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              {/* Ligne 2 (mobile) : quantité + prix de la ligne. */}
              <div className="flex items-center justify-between sm:contents">
                <div className="flex items-center gap-1 rounded-full bg-bg p-1">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                    aria-label="Diminuer la quantité"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface sm:h-7 sm:w-7"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-6 text-center text-sm font-medium tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.lineId, item.quantity + 1)}
                    aria-label="Augmenter la quantité"
                    className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-surface sm:h-7 sm:w-7"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <p className="text-sm font-semibold tabular-nums text-ink sm:w-20 sm:text-right">
                  {item.price * item.quantity} f
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-2xl border border-border bg-surface p-5 lg:sticky lg:top-24">
          <h2 className="font-medium text-ink">Récapitulatif</h2>
          <div className="mt-4 flex items-center justify-between text-sm text-muted">
            <span>{items.reduce((n, i) => n + i.quantity, 0)} article(s)</span>
            <span className="tabular-nums">{totalPrice} f</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3 font-semibold text-ink">
            <span>Total</span>
            <span className="tabular-nums">{totalPrice} f</span>
          </div>

          <button
            type="button"
            onClick={() => setIsOrdering(true)}
            className="mt-5 w-full rounded-full bg-accent py-3 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Commander
          </button>
          <button
            type="button"
            onClick={clearCart}
            className="mt-2 w-full rounded-full py-2 text-sm text-muted hover:text-red-600"
          >
            Vider le panier
          </button>
        </div>
      </div>

      {isOrdering && <OrderTunnel onClose={() => setIsOrdering(false)} />}
    </div>
  )
}
