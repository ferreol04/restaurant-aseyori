import { create } from 'zustand'
import { supabase } from '../lib/supabase'

let realtimeChannel = null

const DEFAULT_SETTINGS = {
  address: 'Adresse à renseigner',
  hours_text: 'Tous les jours — 8h00 à 22h00',
  latitude: null,
  longitude: null,
  whatsapp_number: '',
  facebook_url: '',
  instagram_url: '',
  tiktok_url: '',
  linkedin_url: '',
}

async function fetchSettings() {
  const { data, error } = await supabase
    .from('restaurant_settings')
    .select('*')
    .eq('id', 'main')
    .maybeSingle()
  if (error) throw error
  return data ?? DEFAULT_SETTINGS
}

/**
 * Réglages du restaurant (adresse, horaires, carte) — modifiables depuis
 * l'admin (ex : déménagement). Même cache + invalidation Realtime ciblée
 * que le catalogue (voir store/catalogStore.js).
 */
export const useSettingsStore = create((set, get) => ({
  settings: DEFAULT_SETTINGS,
  // true dès le départ, voir store/adminCatalogStore.js pour le détail :
  // évite un flash de l'état "vide" avant que le chargement ne démarre.
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

    fetchSettings()
      .then((settings) => set({ settings, loading: false, status: 'loaded' }))
      .catch((err) => set({ loading: false, error: err.message, status: 'error' }))
      .finally(() => ensureRealtimeSubscription())
  },

  refetch: () => {
    fetchSettings()
      .then((settings) => set({ settings, error: null }))
      .catch((err) => set({ error: err.message }))
  },
}))

function ensureRealtimeSubscription() {
  if (realtimeChannel) return

  realtimeChannel = supabase
    .channel('restaurant-settings-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'restaurant_settings' },
      () => useSettingsStore.getState().refetch()
    )
    .subscribe()
}
