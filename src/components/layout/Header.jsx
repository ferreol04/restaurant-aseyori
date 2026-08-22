import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X, UtensilsCrossed } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { RESTAURANT_INFO } from '../../data/restaurantInfo'

const NAV_LINKS = [
  { to: '/', label: 'Accueil' },
  { to: '/menu', label: 'Menu' },
  { to: '/contact', label: 'Contact' },
]

function navLinkClass({ isActive }) {
  return `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-accent-light text-accent' : 'text-ink hover:bg-bg'
  }`
}

function mobileNavLinkClass({ isActive }) {
  return `rounded-lg px-3 py-2.5 text-base font-medium ${
    isActive ? 'bg-accent-light text-accent' : 'text-ink hover:bg-bg'
  }`
}

export default function Header() {
  const totalItems = useCartStore((state) => state.totalItems())
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()

  // Le header ne se redémonte pas entre les pages (il fait partie du layout
  // commun) — le menu mobile doit donc se refermer explicitement à chaque
  // changement de page, y compris quand on y arrive via un lien du contenu
  // de la page plutôt que via le menu lui-même (le menu déroulant ne
  // recouvre pas toute la page, le contenu en dessous reste cliquable).
  // Détecté et fermé pendant le rendu (pas dans un effect) pour rester
  // conforme à la règle react-hooks/set-state-in-effect du projet.
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:grid sm:grid-cols-[1fr_auto_1fr] sm:px-6">
        <Link
          to="/"
          className="flex min-w-0 items-center gap-2.5 justify-self-start"
          onClick={() => {
            setMenuOpen(false)
            // Si on est déjà sur l'accueil, React Router ne déclenche aucun
            // changement de route (donc ScrollToTop ne se déclenche pas non
            // plus) — on remonte manuellement en haut de page dans ce cas.
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
            <UtensilsCrossed size={17} />
          </span>
          <span className="truncate font-display text-lg font-semibold text-ink">
            {RESTAURANT_INFO.name}
          </span>
        </Link>

        <nav className="hidden gap-1 justify-self-center sm:flex">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={navLinkClass} end={link.to === '/'}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-self-end gap-1">
          <Link
            to="/panier"
            className="relative rounded-full p-2.5 text-ink transition-colors hover:bg-bg"
            aria-label="Voir le panier"
          >
            <ShoppingCart size={21} strokeWidth={2} />
            {totalItems > 0 && (
              <span className="absolute right-0.5 top-0.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white ring-2 ring-surface">
                {totalItems}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            className="rounded-full p-2.5 text-ink hover:bg-bg sm:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-surface px-4 py-3 sm:hidden">
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={mobileNavLinkClass}
                end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
