import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'

/**
 * Bandeau discret rappelant le contenu du panier pendant la navigation sur
 * le Menu, avec un accès direct à la finalisation. N'apparaît que si le
 * panier contient au moins un article — jamais encombrant sur une visite
 * qui ne fait que consulter le menu, et se met à jour en temps réel au fil
 * des ajouts, sans jamais bloquer la poursuite des achats.
 */
export default function FloatingCartBar() {
  const items = useCartStore((state) => state.items)
  const totalItems = useCartStore((state) => state.totalItems())
  const totalPrice = useCartStore((state) => state.totalPrice())

  if (items.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex justify-start px-4 sm:pl-6">
      <Link
        to="/panier"
        className="pointer-events-auto flex items-center gap-2 rounded-full bg-accent py-2 pl-3 pr-2 text-white shadow-lift transition-transform hover:-translate-y-0.5 active:scale-95 sm:gap-3 sm:py-2.5 sm:pl-4"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/15">
          <ShoppingBag size={16} />
        </span>
        <span className="whitespace-nowrap text-sm font-medium">
          {totalItems} article{totalItems > 1 ? 's' : ''}
          <span className="mx-1.5 opacity-50">·</span>
          <span className="tabular-nums">{totalPrice} f</span>
        </span>
        <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-white/15 py-2 pl-3 pr-3 text-sm font-medium sm:pr-3.5">
          <span className="hidden sm:inline">Voir mon panier</span>
          <span className="sm:hidden">Panier</span>
          <ArrowRight size={14} />
        </span>
      </Link>
    </div>
  )
}
