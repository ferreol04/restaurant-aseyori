import { useMemo } from 'react'

/**
 * Pagination pure côté client sur un tableau déjà chargé. Ne gère pas la
 * remise à la page 1 lors d'un changement de filtre — c'est aux composants
 * appelants d'appeler `setPage(1)` dans leurs gestionnaires d'événements
 * (recherche, filtre, rechargement des données…).
 */
export function usePagination(items, page, pageSize) {
  return useMemo(() => {
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    return { page: safePage, totalPages, pageItems: items.slice(start, start + pageSize) }
  }, [items, page, pageSize])
}
