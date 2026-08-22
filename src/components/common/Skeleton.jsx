/** Bloc de base pour les squelettes de chargement — anime en pulsation. */
export default function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-md bg-border ${className}`} />
}
