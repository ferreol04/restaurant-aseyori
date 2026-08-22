import { create } from 'zustand'
import { supabase } from '../lib/supabase'

let realtimeChannel = null

// Cache disque (localStorage) — survit à un rafraîchissement de page, à la
// fermeture de l'onglet ou à une longue pause (le cache mémoire du store,
// lui, est détruit dans ces cas car il ne vit que le temps du JavaScript
// chargé). On garde une durée de validité courte : passé ce délai, les
// données du disque sont affichées instantanément (pas de skeleton) mais
// revalidées en silence auprès de Supabase, au cas où l'admin ait modifié
// le catalogue pendant que l'onglet était fermé/inactif — Realtime ne peut
// pas le savoir puisqu'il n'écoutait plus.
const CACHE_KEY = 'catalog-cache-v1'
const CACHE_TTL_MS = 15 * 60 * 1000 // 15 minutes

function readDiskCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || !Array.isArray(parsed.categories) || !Array.isArray(parsed.products)) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function writeDiskCache(categories, products) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ categories, products, savedAt: Date.now() }))
  } catch {
    // Stockage indisponible (navigation privée, quota dépassé…) — on
    // continue simplement sans cache disque, le cache mémoire suffit.
  }
}

async function fetchCatalogFromSupabase() {
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

  const products = (productsRes.data ?? []).map((p) => ({
    id: p.id,
    category: p.category_id,
    subcategory: p.subcategory_id,
    name: p.name,
    description: p.description,
    image: p.image_url,
    prices: p.prices,
    priceDescriptions: p.price_descriptions ?? [],
  }))

  return { categories, products }
}

/**
 * Cache mémoire partagé du catalogue (produits/catégories/sous-catégories).
 * Chargé une seule fois pour toute la session, quel que soit le nombre de
 * pages qui l'utilisent (Accueil, Menu…) — plus de rechargement à chaque
 * navigation. Se tient à jour via un unique abonnement Supabase Realtime :
 * une modification côté admin déclenche une invalidation ciblée (refetch),
 * les visites/navigations normales ne déclenchent jamais de requête.
 */
const diskCache = readDiskCache()
const diskCacheIsFresh = Boolean(diskCache) && Date.now() - diskCache.savedAt < CACHE_TTL_MS
let hasRevalidatedStaleDiskCache = false

export const useCatalogStore = create((set, get) => ({
  categories: diskCache?.categories ?? [],
  products: diskCache?.products ?? [],
  // Si rien n'a été trouvé sur le disque, on démarre en chargement (évite
  // un flash de l'état "vide" avant que ensureLoaded() ne s'exécute) — voir
  // store/adminCatalogStore.js pour le même principe.
  loading: !diskCache,
  error: null,
  // Une donnée trouvée sur le disque compte déjà comme "loaded" : la page
  // l'affiche tout de suite, sans skeleton, pendant qu'on la revalide au
  // besoin en arrière-plan.
  status: diskCache ? 'loaded' : 'idle', // idle | loading | loaded | error

  ensureLoaded: () => {
    const { status } = get()
    if (status === 'loading') {
      ensureRealtimeSubscription()
      return
    }
    if (status === 'loaded') {
      ensureRealtimeSubscription()
      if (!diskCacheIsFresh && !hasRevalidatedStaleDiskCache) {
        hasRevalidatedStaleDiskCache = true
        get().refetch()
      }
      return
    }

    set({ status: 'loading', loading: true, error: null })

    fetchCatalogFromSupabase()
      .then(({ categories, products }) => {
        set({ categories, products, loading: false, status: 'loaded' })
        writeDiskCache(categories, products)
      })
      .catch((err) => {
        set({ loading: false, error: err.message, status: 'error' })
      })
      .finally(() => {
        ensureRealtimeSubscription()
      })
  },

  // Invalidation ciblée : ne se déclenche que sur un vrai changement de
  // données (événement Realtime), jamais sur une simple navigation.
  refetch: () => {
    fetchCatalogFromSupabase()
      .then(({ categories, products }) => {
        set({ categories, products, error: null, status: 'loaded' })
        writeDiskCache(categories, products)
      })
      .catch((err) => {
        set({ error: err.message })
      })
  },
}))

function ensureRealtimeSubscription() {
  if (realtimeChannel) return

  realtimeChannel = supabase
    .channel('catalog-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () =>
      useCatalogStore.getState().refetch()
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'categories' }, () =>
      useCatalogStore.getState().refetch()
    )
    .on('postgres_changes', { event: '*', schema: 'public', table: 'subcategories' }, () =>
      useCatalogStore.getState().refetch()
    )
    .subscribe()
}
