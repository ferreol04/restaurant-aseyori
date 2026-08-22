import { useState } from 'react'
import { UtensilsCrossed, ShoppingCart, MessageCircle } from 'lucide-react'
import ModalPortal from './ModalPortal'

const STORAGE_KEY = 'restaurant-guided-tour-seen'

const STEPS = [
  {
    icon: UtensilsCrossed,
    title: 'Découvrez le menu',
    text: "Parcourez nos catégories (Petit Déjeuner, Résistance, Boissons…) ou utilisez la recherche pour trouver un plat précis.",
  },
  {
    icon: ShoppingCart,
    title: 'Composez votre panier',
    text: 'Ajoutez les plats qui vous font envie. Pour les prix multiples, choisissez la taille ou la portion qui vous convient.',
  },
  {
    icon: MessageCircle,
    title: 'Commandez en un clic',
    text: 'Depuis le panier, choisissez livraison, retrait ou repas sur place — votre commande est envoyée directement sur WhatsApp.',
  },
]

function hasSeenTour() {
  if (typeof window === 'undefined') return true
  return Boolean(localStorage.getItem(STORAGE_KEY))
}

export default function GuidedTour() {
  const [visible, setVisible] = useState(() => !hasSeenTour())
  const [step, setStep] = useState(0)

  function close() {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  function next() {
    if (step === STEPS.length - 1) {
      close()
    } else {
      setStep((s) => s + 1)
    }
  }

  if (!visible) return null

  const current = STEPS[step]
  const Icon = current.icon

  return (
    <ModalPortal>
    <div className="fixed inset-0 z-50 flex transform-gpu items-center justify-center bg-ink/55 p-4">
      <div className="w-full max-w-sm animate-[slide-up_0.25s_ease-out] rounded-3xl bg-surface p-7 text-center shadow-lift">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-accent">
          <Icon size={26} />
        </div>
        <h2 className="mt-5 font-display text-xl font-semibold text-ink">{current.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{current.text}</p>

        <div className="mt-5 flex justify-center gap-1.5">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${i === step ? 'bg-accent' : 'bg-border'}`}
            />
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <button type="button" onClick={close} className="text-sm text-muted hover:text-ink">
            Passer
          </button>
          <button
            type="button"
            onClick={next}
            className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-white hover:bg-accent-dark"
          >
            {step === STEPS.length - 1 ? "C'est parti" : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}
