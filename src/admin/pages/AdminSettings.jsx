import { useEffect, useState } from 'react'
import { MapPin, Loader2, CheckCircle2, Share2, MessageCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useSettingsStore } from '../../store/settingsStore'
import { buildMapEmbedUrl } from '../../lib/maps'
import { FacebookIcon, InstagramIcon, TiktokIcon, LinkedinIcon } from '../../components/common/SocialIcons'
import Skeleton from '../../components/common/Skeleton'

const SOCIAL_FIELDS = [
  { key: 'facebook_url', label: 'Facebook', icon: FacebookIcon, placeholder: 'https://facebook.com/...' },
  { key: 'instagram_url', label: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/...' },
  { key: 'tiktok_url', label: 'TikTok', icon: TiktokIcon, placeholder: 'https://tiktok.com/@...' },
  { key: 'linkedin_url', label: 'LinkedIn', icon: LinkedinIcon, placeholder: 'https://linkedin.com/company/...' },
]

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light'

export default function AdminSettings() {
  const settings = useSettingsStore((state) => state.settings)
  const loading = useSettingsStore((state) => state.loading)
  const ensureLoaded = useSettingsStore((state) => state.ensureLoaded)

  const [address, setAddress] = useState('')
  const [hoursText, setHoursText] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)
  const [geoStatus, setGeoStatus] = useState('idle') // idle | loading | done | error
  const [savingLocation, setSavingLocation] = useState(false)
  const [locationStatus, setLocationStatus] = useState('idle') // idle | saved | error
  const [locationError, setLocationError] = useState('')

  const [socialUrls, setSocialUrls] = useState({})
  const [savingSocial, setSavingSocial] = useState(false)
  const [socialStatus, setSocialStatus] = useState('idle') // idle | saved | error
  const [socialError, setSocialError] = useState('')

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  // Synchronise le formulaire avec les réglages chargés depuis le cache —
  // pendant le rendu (pas d'effect), pour ne pas écraser une saisie en
  // cours si le cache se met à jour depuis un autre onglet.
  const [syncedFrom, setSyncedFrom] = useState(null)
  if (settings !== syncedFrom) {
    setSyncedFrom(settings)
    setAddress(settings.address ?? '')
    setHoursText(settings.hours_text ?? '')
    setWhatsappNumber(settings.whatsapp_number ?? '')
    setLatitude(settings.latitude ?? null)
    setLongitude(settings.longitude ?? null)
    setSocialUrls({
      facebook_url: settings.facebook_url ?? '',
      instagram_url: settings.instagram_url ?? '',
      tiktok_url: settings.tiktok_url ?? '',
      linkedin_url: settings.linkedin_url ?? '',
    })
  }

  function handleSharePosition() {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude)
        setLongitude(position.coords.longitude)
        setGeoStatus('done')
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleSaveLocation(e) {
    e.preventDefault()
    setSavingLocation(true)
    setLocationStatus('idle')
    setLocationError('')

    const { error: saveError } = await supabase
      .from('restaurant_settings')
      .update({
        address: address.trim(),
        hours_text: hoursText.trim(),
        whatsapp_number: whatsappNumber.trim(),
        latitude,
        longitude,
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'main')

    setSavingLocation(false)

    if (saveError) {
      setLocationStatus('error')
      setLocationError(saveError.message)
      return
    }
    setLocationStatus('saved')
  }

  async function handleSaveSocial(e) {
    e.preventDefault()
    setSavingSocial(true)
    setSocialStatus('idle')
    setSocialError('')

    const { error: saveError } = await supabase
      .from('restaurant_settings')
      .update({
        facebook_url: socialUrls.facebook_url.trim(),
        instagram_url: socialUrls.instagram_url.trim(),
        tiktok_url: socialUrls.tiktok_url.trim(),
        linkedin_url: socialUrls.linkedin_url.trim(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', 'main')

    setSavingSocial(false)

    if (saveError) {
      setSocialStatus('error')
      setSocialError(saveError.message)
      return
    }
    setSocialStatus('saved')
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-56" />
            <Skeleton className="h-3 w-72" />
          </div>
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-full" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const previewUrl = buildMapEmbedUrl(latitude, longitude)

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
          <MapPin size={18} />
        </span>
        <div>
          <h2 className="font-display text-2xl font-semibold text-ink">Lieu, horaires & réseaux</h2>
          <p className="text-sm text-muted">
            Visibles sur l'Accueil, la page Contact et le pied de page.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px] lg:items-start">
        <form
          onSubmit={handleSaveLocation}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft"
        >
          <div>
            <label className="text-sm font-medium text-ink">Adresse (texte affiché aux clients)</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ex : Quartier Fidjrossè, Cotonou"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Horaires</label>
            <input
              type="text"
              value={hoursText}
              onChange={(e) => setHoursText(e.target.value)}
              placeholder="Ex : Tous les jours — 8h00 à 22h00"
              className={inputClass}
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <MessageCircle size={15} className="text-accent" />
              Numéro WhatsApp (commandes)
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Format international sans "+" ni espaces, ex : 22990000000. Reçoit toutes les
              commandes envoyées depuis le site.
            </p>
            <input
              type="tel"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="Ex : 22990000000"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Position du restaurant</label>
            <p className="mt-0.5 text-xs text-muted">
              Rendez-vous sur place, puis partagez votre position — elle sera utilisée pour la
              carte affichée aux clients.
            </p>

            <button
              type="button"
              onClick={handleSharePosition}
              disabled={geoStatus === 'loading'}
              className={`mt-2.5 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                latitude != null
                  ? 'bg-accent-light text-accent'
                  : 'bg-bg text-ink hover:bg-accent-light hover:text-accent'
              }`}
            >
              {geoStatus === 'loading' ? (
                <Loader2 size={16} className="animate-spin" />
              ) : latitude != null ? (
                <CheckCircle2 size={16} />
              ) : (
                <MapPin size={16} />
              )}
              {latitude != null ? 'Position enregistrée — cliquer pour actualiser' : 'Partager ma position'}
            </button>

            {geoStatus === 'error' && (
              <p className="mt-2 text-sm text-red-600">
                Impossible d'accéder à votre position. Vérifiez que la localisation est autorisée
                pour ce site.
              </p>
            )}

            {previewUrl && (
              <div className="mt-3 overflow-hidden rounded-xl border border-border">
                <iframe
                  title="Aperçu de la position"
                  src={previewUrl}
                  className="h-48 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>

          {locationStatus === 'error' && <p className="text-sm text-red-600">{locationError}</p>}
          {locationStatus === 'saved' && <p className="text-sm text-accent">Enregistré ✓</p>}

          <button
            type="submit"
            disabled={savingLocation}
            className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto sm:px-8"
          >
            {savingLocation ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>

        <form
          onSubmit={handleSaveSocial}
          className="space-y-4 rounded-2xl border border-border bg-surface p-6 shadow-soft"
        >
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-ink">
              <Share2 size={15} className="text-accent" />
              Réseaux sociaux
            </label>
            <p className="mt-0.5 text-xs text-muted">
              Affichés en pied de page. Laisser vide pour ne pas afficher l'icône.
            </p>
          </div>

          <div className="space-y-2.5">
            {SOCIAL_FIELDS.map((field) => {
              const Icon = field.icon
              return (
                <div key={field.key} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg text-muted">
                    <Icon size={16} />
                  </span>
                  <input
                    type="url"
                    value={socialUrls[field.key] ?? ''}
                    onChange={(e) =>
                      setSocialUrls((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-border bg-bg px-3.5 py-2 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
                  />
                </div>
              )
            })}
          </div>

          {socialStatus === 'error' && <p className="text-sm text-red-600">{socialError}</p>}
          {socialStatus === 'saved' && <p className="text-sm text-accent">Enregistré ✓</p>}

          <button
            type="submit"
            disabled={savingSocial}
            className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {savingSocial ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
  )
}
