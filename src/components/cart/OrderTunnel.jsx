import { useState } from 'react'
import { X, MapPin, Loader2, Truck, Store, UtensilsCrossed } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'
import { buildOrderMessage, buildWhatsAppLink, RESTAURANT_WHATSAPP_NUMBER } from '../../lib/whatsapp'
import ModalPortal from '../common/ModalPortal'

const MODES = [
  { id: 'delivery', label: 'Livraison', icon: Truck },
  { id: 'pickup', label: 'Retrait', icon: Store },
  { id: 'dine-in', label: 'Sur place', icon: UtensilsCrossed },
]

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light'

export default function OrderTunnel({ onClose }) {
  const items = useCartStore((state) => state.items)
  const totalPrice = useCartStore((state) => state.totalPrice())
  const clearCart = useCartStore((state) => state.clearCart)
  const { settings } = useRestaurantSettings()
  const whatsappNumber = settings.whatsapp_number || RESTAURANT_WHATSAPP_NUMBER

  const [mode, setMode] = useState('delivery')
  const [phone, setPhone] = useState('')
  const [locationMethod, setLocationMethod] = useState('gps') // 'gps' | 'text'
  const [locationLink, setLocationLink] = useState('')
  const [locationText, setLocationText] = useState('')
  const [geoStatus, setGeoStatus] = useState('idle') // idle | loading | done | error
  const [arrivalTime, setArrivalTime] = useState('')
  const [note, setNote] = useState('')
  const [formError, setFormError] = useState('')

  function handleShareLocation() {
    if (!navigator.geolocation) {
      setGeoStatus('error')
      return
    }
    setGeoStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocationLink(`https://www.google.com/maps?q=${latitude},${longitude}`)
        setGeoStatus('done')
      },
      () => setGeoStatus('error'),
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  function validate() {
    if (!whatsappNumber) {
      return "Le numéro WhatsApp du restaurant n'est pas configuré."
    }
    if (mode === 'delivery') {
      if (!phone.trim()) return 'Merci de renseigner un numéro de téléphone.'
      if (locationMethod === 'gps' && !locationLink) {
        return 'Merci de partager votre position, ou de choisir la saisie manuelle.'
      }
      if (locationMethod === 'text' && !locationText.trim()) {
        return 'Merci d’indiquer votre adresse.'
      }
    }
    if (mode === 'pickup' && !phone.trim()) {
      return 'Merci de renseigner un numéro de téléphone.'
    }
    if (mode === 'dine-in') {
      if (!phone.trim()) return 'Merci de renseigner un numéro de téléphone.'
      if (!arrivalTime) return "Merci d'indiquer l'heure d'arrivée souhaitée."
    }
    return ''
  }

  function handleSubmit(e) {
    e.preventDefault()
    const error = validate()
    if (error) {
      setFormError(error)
      return
    }
    setFormError('')

    const details = {
      phone,
      locationLink: mode === 'delivery' && locationMethod === 'gps' ? locationLink : undefined,
      locationText: mode === 'delivery' && locationMethod === 'text' ? locationText : undefined,
      arrivalTime: mode === 'dine-in' ? arrivalTime : undefined,
    }

    const message = buildOrderMessage({ items, total: totalPrice, mode, details, note })
    const link = buildWhatsAppLink(message, whatsappNumber)

    window.open(link, '_blank', 'noopener,noreferrer')
    clearCart()
    onClose()
  }

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex transform-gpu items-end justify-center bg-ink/55 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg animate-[slide-up_0.25s_ease-out] overflow-y-auto rounded-t-3xl bg-surface sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink">Finaliser la commande</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-bg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-6">
          <div>
            <p className="text-sm font-medium text-ink">Mode de récupération</p>
            <div className="mt-2.5 grid grid-cols-3 gap-2">
              {MODES.map((m) => {
                const Icon = m.icon
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMode(m.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl py-3 text-xs font-medium transition-colors ${
                      mode === m.id
                        ? 'bg-accent text-white shadow-soft'
                        : 'bg-bg text-ink hover:bg-accent-light'
                    }`}
                  >
                    <Icon size={19} />
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink">Numéro de téléphone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : 0197000000"
              className={inputClass}
            />
          </div>

          {mode === 'delivery' && (
            <div>
              <p className="text-sm font-medium text-ink">Votre position</p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setLocationMethod('gps')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    locationMethod === 'gps'
                      ? 'bg-ink text-white'
                      : 'bg-bg text-muted hover:text-ink'
                  }`}
                >
                  Partager ma position
                </button>
                <button
                  type="button"
                  onClick={() => setLocationMethod('text')}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                    locationMethod === 'text'
                      ? 'bg-ink text-white'
                      : 'bg-bg text-muted hover:text-ink'
                  }`}
                >
                  Saisir une adresse
                </button>
              </div>

              {locationMethod === 'gps' ? (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleShareLocation}
                    disabled={geoStatus === 'loading'}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60 ${
                      geoStatus === 'done'
                        ? 'bg-accent-light text-accent'
                        : 'bg-bg text-ink hover:bg-accent-light hover:text-accent'
                    }`}
                  >
                    {geoStatus === 'loading' ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <MapPin size={16} />
                    )}
                    {geoStatus === 'done' ? 'Position enregistrée ✓' : 'Utiliser ma position actuelle'}
                  </button>
                  {geoStatus === 'error' && (
                    <p className="mt-2 text-sm text-red-600">
                      Impossible d'accéder à votre position. Essayez la saisie manuelle.
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  placeholder="Ex : Quartier Fidjrossè, non loin de la pharmacie…"
                  rows={2}
                  className={inputClass}
                />
              )}
            </div>
          )}

          {mode === 'dine-in' && (
            <div>
              <label className="text-sm font-medium text-ink">
                Heure d'arrivée prévue au restaurant
              </label>
              <p className="mt-0.5 text-xs text-muted">
                Pour que votre commande soit prête à votre arrivée.
              </p>
              <input
                type="time"
                value={arrivalTime}
                onChange={(e) => setArrivalTime(e.target.value)}
                className={inputClass}
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-ink">
              Note (allergies, préférences…) <span className="font-normal text-muted">— facultatif</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ex : sans oignons, spaghetti peu mouillé…"
              rows={2}
              className={inputClass}
            />
          </div>

          <p className="rounded-xl bg-bg px-4 py-3 text-xs leading-relaxed text-muted">
            Paiement en espèces, à la réception (livraison) ou sur place (retrait / repas sur place).
          </p>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            className="flex w-full items-center justify-between rounded-full bg-accent py-3.5 pl-6 pr-2 font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Envoyer sur WhatsApp
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-sm tabular-nums">
              {totalPrice} f
            </span>
          </button>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
