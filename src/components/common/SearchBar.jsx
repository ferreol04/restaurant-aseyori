import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange, placeholder = 'Rechercher un produit…' }) {
  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-border bg-surface py-3 pl-11 pr-4 text-sm shadow-soft transition-shadow focus:border-accent focus:shadow-none focus:outline-none focus:ring-2 focus:ring-accent-light"
      />
    </div>
  )
}
