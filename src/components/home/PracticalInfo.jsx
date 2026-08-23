import { Clock, MapPin, MessageCircle } from 'lucide-react'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'
import { RESTAURANT_WHATSAPP_NUMBER } from '../../lib/whatsapp'

export default function PracticalInfo() {
  const { settings } = useRestaurantSettings()
  const whatsappNumber = settings.whatsapp_number || RESTAURANT_WHATSAPP_NUMBER

  const cards = [
    { icon: Clock, title: 'Horaires', body: settings.hours_text },
    { icon: MapPin, title: 'Où nous trouver', body: settings.address },
  ]

  return (
    <section className="bg-bg pt-8 pb-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="rounded-2xl border border-border bg-surface p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent-light text-accent">
                  <Icon size={20} />
                </span>
                <h3 className="mt-4 font-medium text-ink">{card.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{card.body}</p>
              </div>
            )
          })}

          <div className="rounded-2xl bg-accent p-6 text-white">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white">
              <MessageCircle size={20} />
            </span>
            <h3 className="mt-4 font-medium">Commander directement</h3>
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
        </div>
      </div>
    </section>
  )
}
