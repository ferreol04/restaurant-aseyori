import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-ink">Page introuvable</h1>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">
        Retour à l'accueil
      </Link>
    </div>
  )
}
