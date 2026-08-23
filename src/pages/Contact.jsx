import { useState } from 'react'
import { MapPin, Clock, Phone, MessageCircle, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useRestaurantSettings } from '../hooks/useRestaurantSettings'
import { RESTAURANT_WHATSAPP_NUMBER } from '../lib/whatsapp'
import { buildMapEmbedUrl } from '../lib/maps'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light'

export default function Contact() {
  const { settings } = useRestaurantSettings()
  const whatsappNumber = settings.whatsapp_number || RESTAURANT_WHATSAPP_NUMBER
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!message.trim()) return

    setStatus('sending')
    const { error } = await supabase
      .from('messages')
      .insert({ name: name.trim() || null, message: message.trim() })

    if (error) {
      setStatus('error')
      return
    }
    setStatus('sent')
    setName('')
    setMessage('')
  }

  return (
    <div>
      <div className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            Restons en contact
          </span>
          <h1 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">
            Contact
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
                  <MapPin size={18} />
                </span>
                <h2 className="mt-3 font-medium text-ink">Adresse</h2>
                <p className="mt-1 text-sm text-muted">{settings.address}</p>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
                  <Clock size={18} />
                </span>
                <h2 className="mt-3 font-medium text-ink">Horaires</h2>
                <p className="mt-1 text-sm text-muted">{settings.hours_text}</p>
              </div>

              {whatsappNumber && (
                <div className="rounded-2xl border border-border bg-surface p-5 sm:col-span-2">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-light text-accent">
                    <Phone size={18} />
                  </span>
                  <h2 className="mt-3 font-medium text-ink">Téléphone</h2>
                  <p className="mt-1 text-sm text-muted">
                    +{whatsappNumber}
                    <span className="ml-2 text-xs">
                      — à composer au cas où le WhatsApp n'est pas disponible
                    </span>
                  </p>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-accent p-5 text-white">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15">
                <MessageCircle size={18} />
              </span>
              <h2 className="mt-3 font-medium">Nous contacter directement</h2>
              {whatsappNumber ? (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-accent hover:bg-white/90"
                >
                  Nous écrire sur WhatsApp
                </a>
              ) : (
                <p className="mt-1.5 text-sm text-white/70">Numéro WhatsApp à configurer.</p>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-border">
              {settings.latitude != null && settings.longitude != null ? (
                <iframe
                  title="Localisation du restaurant"
                  src={buildMapEmbedUrl(settings.latitude, settings.longitude)}
                  className="h-64 w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="flex h-56 w-full items-center justify-center bg-bg text-sm text-muted">
                  Carte à venir
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="font-display text-xl font-semibold text-ink">
              Vos appréciations et suggestions
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Un avis, une suggestion ? Écrivez-nous directement — vos messages sont lus par la
              restauratrice, en privé.
            </p>

            {status === 'sent' ? (
              <div className="mt-8 flex flex-col items-center rounded-xl bg-accent-light py-10 text-center">
                <CheckCircle2 size={32} className="text-accent" />
                <p className="mt-3 font-medium text-ink">Message envoyé, merci !</p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-3 text-sm font-medium text-accent hover:underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-ink">
                    Nom <span className="font-normal text-muted">— facultatif</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={inputClass}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-sm text-red-600">
                    Une erreur est survenue, merci de réessayer.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60 sm:w-auto sm:px-8"
                >
                  {status === 'sending' ? 'Envoi…' : 'Envoyer'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
