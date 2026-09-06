import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, X } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import ModalPortal from '../common/ModalPortal'
import ImagePlaceholder from '../common/ImagePlaceholder'
import OrderTunnel from './OrderTunnel'

/**
 * Panneau latéral (Cart Drawer) qui remplace l'ancienne page /panier :
 * le contenu du panier reste accessible depuis n'importe quel écran sans
 * jamais quitter la page en cours. Piloté globalement via
 * `useCartStore().isDrawerOpen` / `openDrawer` / `closeDrawer`, monté une
 * seule fois dans MainLayout.
 */
export default function CartDrawer() {
  const isOpen = useCartStore((state) => state.isDrawerOpen)
  const closeDrawer = useCartStore((state) => state.closeDrawer)
  const items = useCartStore((state) => state.items)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeItem = useCartStore((state) => state.removeItem)
  const clearCart = useCartStore((state) => state.clearCart)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const [isOrdering, setIsOrdering] = useState(false)

  // Empêche le défilement de la page en dessous tant que le drawer est
  // ouvert — sans ça, la page derrière l'overlay reste scrollable au
  // toucher/molette, ce qui casse l'effet de surimpression. On restaure la
  // valeur précédente (plutôt qu'une chaîne vide en dur) pour rester
  // compatible avec un éventuel autre verrou de scroll déjà posé.
  useEffect(() => {
    if (!isOpen) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <ModalPortal>
      <div className="fixed inset-0 z-50 flex justify-end">
        <div
          className="absolute inset-0 animate-[fade-in_0.2s_ease-out] bg-ink/55"
          onClick={closeDrawer}
        />

        <div className="relative flex h-full w-full max-w-md animate-[slide-in-right_0.25s_ease-out] flex-col bg-surface shadow-lift">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-display text-lg font-semibold text-ink">Votre panier</h2>
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Fermer le panier"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-bg"
            >
              <X size={18} />
            </button>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-light text-accent">
                <ShoppingBag size={26} />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                Votre panier est vide
              </h3>
              <p className="mt-2 text-sm text-muted">
                Parcourez le menu et ajoutez vos plats préférés pour commencer une commande.
              </p>
              <Link
                to="/menu"
                onClick={closeDrawer}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 font-medium text-white hover:bg-accent-dark"
              >
                Voir le menu
                <ArrowRight size={17} />
              </Link>
            </div>
          ) : (
            <>
              <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {items.map((item) => (
                  <li
                    key={item.lineId}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-bg/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
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
                        className="rounded-full p-2.5 text-muted hover:bg-bg hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full bg-bg p-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.lineId, item.quantity - 1)}
                          aria-label="Diminuer la quantité"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-surface"
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
                          className="flex h-8 w-8 items-center justify-center rounded-full text-ink hover:bg-surface"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <p className="text-sm font-semibold tabular-nums text-ink">
                        {item.price * item.quantity} f
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="border-t border-border px-5 py-4">
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>{items.reduce((n, i) => n + i.quantity, 0)} article(s)</span>
                  <span className="tabular-nums">{totalPrice} f</span>
                </div>
                <div className="mt-2 flex items-center justify-between font-semibold text-ink">
                  <span>Total</span>
                  <span className="tabular-nums">{totalPrice} f</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOrdering(true)}
                  className="mt-4 w-full rounded-full bg-accent py-3 font-medium text-white transition-colors hover:bg-accent-dark"
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
            </>
          )}
        </div>
      </div>

      {isOrdering && <OrderTunnel onClose={() => setIsOrdering(false)} />}
    </ModalPortal>
  )
}
