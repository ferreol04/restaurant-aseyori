// Icônes de réseaux sociaux — absentes de la librairie d'icônes du projet
// (lucide-react n'inclut plus les logos de marques), donc dessinées ici en
// SVG simple, monochrome (héritent de la couleur du texte).

export function FacebookIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 22v-8.5H16l.5-3.5h-3V7.7c0-1 .3-1.7 1.7-1.7H16.5V2.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7v3.5h2.8V22h3.7Z" />
    </svg>
  )
}

export function InstagramIcon({ size = 18, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function LinkedinIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.94 8.5H3.56V21h3.38V8.5ZM5.25 3a1.96 1.96 0 1 0 0 3.92A1.96 1.96 0 0 0 5.25 3ZM21 13.9c0-3.4-1.8-5-4.2-5-1.6 0-2.6.87-3 1.7h-.05V8.5H10.5V21h3.38v-6.6c0-1.75.33-3.44 2.5-3.44 2.14 0 2.17 2 2.17 3.55V21H21v-7.1Z" />
    </svg>
  )
}

export function TiktokIcon({ size = 18, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.6 3c.32 2.16 1.96 3.8 4.2 4v3.1a7.3 7.3 0 0 1-4.2-1.4v6.7a5.9 5.9 0 1 1-5.1-5.85v3.13a2.8 2.8 0 1 0 2 2.68V3h3.1Z" />
    </svg>
  )
}
