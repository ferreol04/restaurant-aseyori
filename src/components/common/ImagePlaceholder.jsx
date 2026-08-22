import { UtensilsCrossed } from 'lucide-react'

/**
 * Substitut visuel tant qu'aucune vraie photo n'est disponible pour un
 * produit. Un dégradé de la palette + icône, plutôt qu'une case vide.
 */
export default function ImagePlaceholder({ className = '' }) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-accent-light to-bg ${className}`}
    >
      <UtensilsCrossed size={28} strokeWidth={1.5} className="text-accent/30" />
    </div>
  )
}
