import { useEffect } from 'react'
import { useSettingsStore } from '../store/settingsStore'

/** Donne accès aux réglages du restaurant (adresse, horaires, carte), mis en cache. */
export function useRestaurantSettings() {
  const settings = useSettingsStore((state) => state.settings)
  const loading = useSettingsStore((state) => state.loading)
  const ensureLoaded = useSettingsStore((state) => state.ensureLoaded)

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  return { settings, loading }
}
