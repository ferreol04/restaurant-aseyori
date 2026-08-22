import { create } from 'zustand'
import { supabase } from '../lib/supabase'

let realtimeChannel = null

async function fetchMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/**
 * Cache mémoire des messages (appréciations/suggestions), avec invalidation
 * ciblée via Supabase Realtime — voir store/catalogStore.js pour le même
 * principe appliqué au catalogue.
 */
export const useMessagesStore = create((set, get) => ({
  messages: [],
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

    fetchMessages()
      .then((messages) => set({ messages, loading: false, status: 'loaded' }))
      .catch((err) => set({ loading: false, error: err.message, status: 'error' }))
      .finally(() => ensureRealtimeSubscription())
  },

  refetch: () => {
    fetchMessages()
      .then((messages) => set({ messages, error: null }))
      .catch((err) => set({ error: err.message }))
  },
}))

function ensureRealtimeSubscription() {
  if (realtimeChannel) return

  realtimeChannel = supabase
    .channel('admin-messages-changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () =>
      useMessagesStore.getState().refetch()
    )
    .subscribe()
}
