import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LogOut, UtensilsCrossed } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const TABS = [
  { to: '/admin/produits', label: 'Produits' },
  { to: '/admin/categories', label: 'Catégories' },
  { to: '/admin/messages', label: 'Messages' },
  { to: '/admin/reglages', label: 'Réglages' },
]

function tabClass({ isActive }) {
  return `shrink-0 whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
    isActive ? 'bg-accent text-white' : 'text-muted hover:bg-bg hover:text-ink'
  }`
}

export default function AdminLayout() {
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white">
              <UtensilsCrossed size={15} />
            </span>
            <h1 className="font-display text-lg font-semibold text-ink">Administration</h1>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted hover:bg-bg hover:text-ink"
          >
            <LogOut size={15} />
            Se déconnecter
          </button>
        </div>
        <nav className="scrollbar-hide mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-3 sm:px-6">
          {TABS.map((tab) => (
            <NavLink key={tab.to} to={tab.to} className={tabClass}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
