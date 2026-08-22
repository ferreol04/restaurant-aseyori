import { Link } from 'react-router-dom'
import { MapPin, Clock, MessageCircle, UtensilsCrossed } from 'lucide-react'
import { RESTAURANT_INFO } from '../../data/restaurantInfo'
import { useRestaurantSettings } from '../../hooks/useRestaurantSettings'
import { RESTAURANT_WHATSAPP_NUMBER } from '../../lib/whatsapp'
import { FacebookIcon, InstagramIcon, TiktokIcon, LinkedinIcon } from '../common/SocialIcons'

const SOCIAL_LINKS = [
  { key: 'facebook_url', label: 'Facebook', Icon: FacebookIcon },
  { key: 'instagram_url', label: 'Instagram', Icon: InstagramIcon },
  { key: 'tiktok_url', label: 'TikTok', Icon: TiktokIcon },
  { key: 'linkedin_url', label: 'LinkedIn', Icon: LinkedinIcon },
]

export default function Footer() {
  const { settings } = useRestaurantSettings()
  const activeSocialLinks = SOCIAL_LINKS.filter((s) => settings[s.key])
  const whatsappNumber = settings.whatsapp_number || RESTAURANT_WHATSAPP_NUMBER

  return (
    <footer className="bg-ink">
      <div className="mx-auto max-w-6xl px-4 py-9 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-[1.2fr_1fr_1.2fr]">
          <div className="min-w-0">
            <Link to="/" className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                <UtensilsCrossed size={17} />
              </span>
              <span className="truncate font-display text-lg font-semibold text-white">
                {RESTAURANT_INFO.name}
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/55">
              {RESTAURANT_INFO.tagline}
            </p>

            {activeSocialLinks.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {activeSocialLinks.map(({ key, label, Icon }) => (
                  <a
                    key={key}
                    href={settings[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-secondary"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Navigation
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li><Link to="/menu" className="text-white/75 transition-colors hover:text-secondary">Menu</Link></li>
              <li><Link to="/panier" className="text-white/75 transition-colors hover:text-secondary">Panier</Link></li>
              <li><Link to="/contact" className="text-white/75 transition-colors hover:text-secondary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Contact
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="mt-0.5 shrink-0 text-secondary" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-secondary" />
                <span>{settings.hours_text}</span>
              </li>
              {whatsappNumber && (
                <li className="flex items-start gap-2.5">
                  <MessageCircle size={16} className="mt-0.5 shrink-0 text-secondary" />
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors hover:text-secondary"
                  >
                    Nous écrire sur WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-5">
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} {RESTAURANT_INFO.name}. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
