import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'

/**
 * Petit bouton discret pour remonter en haut de page, qui n'apparaît que
 * passé la moitié de la hauteur totale défilable de la page — pas
 * encombrant sur une page courte, utile sur les longues (Menu, Panier…).
 */
export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      setVisible(scrollable > 0 && window.scrollY > scrollable / 2)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Remonter en haut de page"
      className={`fixed bottom-5 right-4 z-30 flex h-11 w-11 items-center justify-center rounded-full bg-surface/80 text-ink shadow-lift ring-1 ring-border transition-all duration-200 hover:bg-surface hover:text-accent active:scale-90 sm:right-6 ${
        visible ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <ArrowUp size={18} />
    </button>
  )
}
