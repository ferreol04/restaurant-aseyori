import { useEffect, useRef } from 'react'
import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '../../data/testimonials'

// Vitesse fixe, en pixels par seconde — pilotée en JavaScript (requestAnimationFrame)
// plutôt que via une durée CSS (animation-duration). Certains navigateurs mobiles
// interprètent mal la durée d'une animation CSS "marquee" (elle est ignorée ou
// écrasée par des optimisations internes au navigateur) ; en calculant nous-mêmes
// la position à chaque image à partir du temps réellement écoulé, la vitesse
// perçue reste identique sur tous les appareils, indépendamment du moteur CSS.
const SPEED_PX_PER_SECOND = 40

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function TestimonialCard({ t }) {
  return (
    <article className="flex w-75 shrink-0 flex-col rounded-2xl border border-border bg-bg p-6 shadow-soft sm:w-85">
      <Quote size={28} className="text-accent-light" fill="currentColor" strokeWidth={0} />

      <div className="mt-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, star) => (
          <Star
            key={star}
            size={14}
            className={star < t.rating ? 'text-secondary' : 'text-border'}
            fill="currentColor"
            strokeWidth={0}
          />
        ))}
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink">{t.message}</p>

      <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white">
          {initials(t.name)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-ink">{t.name}</p>
          {t.detail && <p className="truncate text-xs text-muted">{t.detail}</p>}
        </div>
      </div>
    </article>
  )
}

export default function Testimonials() {
  const trackRef = useRef(null)
  const pausedRef = useRef(false)

  useEffect(() => {
    if (TESTIMONIALS.length === 0) return undefined

    const track = trackRef.current
    if (!track) return undefined

    // Le contenu est dupliqué une fois (voir plus bas) pour boucler sans à-coup :
    // on ne fait donc défiler que la largeur d'un seul jeu de cartes, puis on
    // revient à 0 — visuellement continu puisque le deuxième jeu est identique.
    let halfWidth = track.scrollWidth / 2
    const handleResize = () => {
      halfWidth = track.scrollWidth / 2
    }
    window.addEventListener('resize', handleResize)

    let position = 0
    let lastTimestamp = null
    let frameId = null

    function step(timestamp) {
      if (lastTimestamp === null) lastTimestamp = timestamp
      const elapsedSeconds = (timestamp - lastTimestamp) / 1000
      lastTimestamp = timestamp

      if (!pausedRef.current && halfWidth > 0) {
        position = (position + SPEED_PX_PER_SECOND * elapsedSeconds) % halfWidth
        track.style.transform = `translateX(-${position}px)`
      }

      frameId = requestAnimationFrame(step)
    }

    frameId = requestAnimationFrame(step)

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  if (TESTIMONIALS.length === 0) return null

  return (
    <section className="bg-surface pt-12 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Avis clients
        </span>
        <h2 className="mt-2 font-display text-2xl font-semibold text-ink sm:text-3xl">
          Ce qu'ils en pensent
        </h2>
      </div>

      {/* Défilement continu et lent (survol/focus = pause sur PC, toucher =
          pause sur mobile/tablette — pour laisser le temps de lire). Le
          contenu est dupliqué une fois pour boucler sans à-coup — la
          position est pilotée en JavaScript, voir le commentaire plus haut. */}
      <div className="mt-8 overflow-hidden mask-[linear-gradient(to_right,transparent,black_2rem,black_calc(100%-2rem),transparent)]">
        <div
          ref={trackRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          onFocus={() => (pausedRef.current = true)}
          onBlur={() => (pausedRef.current = false)}
          onTouchStart={() => (pausedRef.current = true)}
          onTouchEnd={() => (pausedRef.current = false)}
          onTouchCancel={() => (pausedRef.current = false)}
          className="flex w-max gap-5 px-4 will-change-transform sm:px-6"
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={`a-${i}`} t={t} />
          ))}
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={`b-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  )
}
