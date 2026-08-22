import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle, Truck, Wallet, UtensilsCrossed } from 'lucide-react'
import { RESTAURANT_INFO } from '../../data/restaurantInfo'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'
import { RESTAURANT_WHATSAPP_NUMBER } from '../../lib/whatsapp'

// En attendant les vraies photos du restaurant, le fond joue sur des nappes
// de couleur de la palette (façon "mesh gradient"). Remplacer par de vraies
// photos plus tard : ajouter un calque <img> derrière, la mécanique de
// rotation et l'overlay restent identiques.
const SLIDES = [
  { a: '#2f4a3c', b: '#4d7259', c: '#c9a467' },
  { a: '#23392e', b: '#2f4a3c', c: '#8a9f6b' },
  { a: '#3a5c48', b: '#23392e', c: '#9c8563' },
]

const SLIDE_DURATION = 6000

// Les 4 garanties mises en avant en bas du hero.
const HIGHLIGHTS = [
  {
    icon: Truck,
    title: 'Livraison rapide',
    text: 'Partout où vous êtes',
  },
  {
    icon: Wallet,
    title: 'Paiement sécurisé',
    text: 'Espèces, dépôt ou virement',
  },
  {
    icon: MessageCircle,
    title: 'Commande facile',
    text: 'Directement via WhatsApp',
  },
  {
    icon: UtensilsCrossed,
    title: 'Menu varié',
    text: 'Du petit déjeuner au dessert',
  },
]

function slideBackground({ a, b, c }) {
  return `radial-gradient(120% 140% at 15% 10%, ${b} 0%, transparent 55%),
          radial-gradient(100% 120% at 90% 85%, ${c} 0%, transparent 45%),
          linear-gradient(160deg, ${a} 0%, #1c2c22 100%)`
}

export default function Hero() {
  const [slideIndex, setSlideIndex] = useState(0)
  const { settings } = useRestaurantSettings()
  const whatsappNumber = settings.whatsapp_number || RESTAURANT_WHATSAPP_NUMBER

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % SLIDES.length)
    }, SLIDE_DURATION)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="relative flex min-h-[calc(100svh-3.5625rem)] flex-col overflow-hidden">
      {/* Zone colorée (dégradés + contenu principal) — occupe tout l'espace
          restant une fois le bandeau des garanties déduit, pour que ce
          dernier soit toujours le dernier élément visible à l'écran. */}
      <div className="relative flex flex-1 flex-col">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            aria-hidden={i !== slideIndex}
            className="absolute inset-0 transition-opacity duration-1400 ease-out"
            style={{ background: slideBackground(slide), opacity: i === slideIndex ? 1 : 0 }}
          />
        ))}

        {/* Grain subtil pour casser l'aspect trop lisse d'un dégradé pur */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 sm:px-6">
          <span className="w-fit rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
            Bienvenue
          </span>

          <h1 className="mt-5 max-w-2xl font-display text-5xl font-semibold leading-[1.05] text-white sm:text-6xl">
            {RESTAURANT_INFO.name}
          </h1>

          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/85">
            {RESTAURANT_INFO.tagline}
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="group flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-medium text-ink shadow-lift transition-transform hover:-translate-y-0.5"
            >
              Voir le menu
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
              >
                <MessageCircle size={17} />
                Commander sur WhatsApp
              </a>
            )}
          </div>
        </div>

        <div className="relative mx-auto mb-3 flex w-full max-w-6xl justify-center gap-2 px-4 sm:mb-4 sm:justify-end sm:px-6">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Aller à l'image ${i + 1}`}
              onClick={() => setSlideIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === slideIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Bandeau des garanties — toujours le dernier visuel de la bannière */}
      <div className="relative z-10 mx-auto -mt-9 w-full max-w-6xl px-4 pb-6 sm:px-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border shadow-lift sm:grid-cols-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-center gap-3 bg-surface px-4 py-4 sm:px-5 sm:py-5">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-light text-accent">
                  <Icon size={19} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold leading-tight text-ink">{item.title}</p>
                  {/* Sur mobile (grid-cols-2), la carte est trop étroite pour
                      afficher la description en entier — un texte tronqué et
                      illisible n'apporte rien, on ne garde que le titre. À
                      partir de sm (4 colonnes, plus de largeur), elle
                      redevient visible. */}
                  <p className="hidden truncate text-xs text-muted sm:block">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
