import { useEffect } from 'react'
import { useCatalogStore } from '../store/catalogStore'

/**
 * Donne accès au catalogue mis en cache (voir store/catalogStore.js).
 * Le premier composant monté déclenche le chargement ; les suivants
 * réutilisent directement le cache, sans nouvelle requête.
 */
export function useCatalog() {
  const categories = useCatalogStore((state) => state.categories)
  const products = useCatalogStore((state) => state.products)
  const loading = useCatalogStore((state) => state.loading)
  const error = useCatalogStore((state) => state.error)
  const ensureLoaded = useCatalogStore((state) => state.ensureLoaded)

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  return { categories, products, loading, error }
}
