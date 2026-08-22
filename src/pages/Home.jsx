import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useCatalog } from '../hooks/useCatalog'
import { RESTAURANT_INFO } from '../data/restaurantInfo'
import Hero from '../components/home/Hero'
import FeaturedProducts from '../components/home/FeaturedProducts'
import PracticalInfo from '../components/home/PracticalInfo'
import Testimonials from '../components/home/Testimonials'

export default function Home() {
  const { products } = useCatalog()

  return (
    <div>
      <Hero />

      <section className="mx-auto max-w-2xl px-4 pt-10 pb-8 text-center sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-accent">
          Notre histoire
        </span>
        <h2 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">
          {RESTAURANT_INFO.name}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted">{RESTAURANT_INFO.intro}</p>
      </section>

      <FeaturedProducts products={products} />

      <PracticalInfo />

      <Testimonials />

      <section className="relative overflow-hidden bg-accent">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Envie de découvrir tout le menu ?
          </h2>
          <p className="mt-3 text-white/80">
            Petit déjeuner, plats de résistance, boissons et desserts — tout est là.
          </p>
          <Link
            to="/menu"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-medium text-ink shadow-lift transition-transform hover:-translate-y-0.5"
          >
            Voir le menu complet
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  )
}
