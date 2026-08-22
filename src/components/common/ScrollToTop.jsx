import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * React Router ne réinitialise pas le défilement lors d'un changement de
 * route (comportement normal d'une SPA). On le fait manuellement à chaque
 * changement de chemin, pour que chaque page s'ouvre depuis le haut.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  return null
}
