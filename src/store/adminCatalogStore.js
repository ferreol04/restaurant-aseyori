import { create } from 'zustand'
import { supabase } from '../lib/supabase'

let realtimeChannel = null

async function fetchAdminCatalog() {
  const [categoriesRes, subcategoriesRes, productsRes] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('subcategories').select('*').order('sort_order'),
    supabase.from('products').select('*').order('sort_order'),
  ])

  const firstError = categoriesRes.error || subcategoriesRes.error || productsRes.error
  if (firstError) throw firstError

  const categories = (categoriesRes.data ?? []).map((category) => ({
    ...category,
    subcategories: (subcategoriesRes.data ?? []).filter((sub) => sub.category_id === category.id),
  }))

  return { categories, products: productsRes.data ?? [] }
}

/**
 * Cache mémoire du catalogue côté admin (lignes brutes de la base, utilisées
 * par les formulaires — category_id, image_url, etc.). Comme pour le
 * catalogue public (store/catalogStore.js), l'invalidation est pilotée par
 * Supabase Realtime : chaque ajout/modification/suppression déclenche un
 * rechargement ciblé du cache, sans action explicite requise après une
 * mutation depuis l'admin.
 */
export const useAdminCatalogStore = create((set, get) => ({
  categories: [],
  products: [],
  // true dès le départ : ensureLoaded() est toujours appelé juste après le
  // montage de la page qui utilise ce store — démarrer à false créerait un
  // flash d'une fraction de seconde de l'état "vide" (ex : "Aucun produit")
  // avant que le chargement ne démarre réellement.
  loading: true,
  error: null,
  status: 'idle', // idle | loading | loaded | error

  ensureLoaded: () => {
    const { status } = get()
    if (status === 'loading' || status === 'loaded') {
      ensureRealtimeSubscription()
      return
    }

    set({ status: 'loading', loading: true, error: null })

    fetchAdminCatalog()
      .then(({ categories, products }) => {
        set({ categories, products, loading: false, status: 'loaded' })
      })
      .catch((err) => {
        set({ loading: false, error: err.message, status: 'error' })
      })
      .finally(() => {
        ensureRealtimeSubscription()
      })
  },

  refetch: () => {
    fetchAdminCatalog()
      .then(({ categories, products }) => {
        set({ categories, products, error: null })
      })
      .catch((err) => {
        set({ error: err.message })
      })
  },
}))

function ensureRealtimeSubscription() {
  if (realtimeChannel) return

  realtimeChannel = supabase
    .channel('admin-catalog-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () =>
      useAdminCatalogStore.getState().refetch()
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () =>
      useAdminCatalogStore.getState().refetch()
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'subcategories' }, () =>
      useAdminCatalogStore.getState().refetch()
    )
    .subscribe()
}
