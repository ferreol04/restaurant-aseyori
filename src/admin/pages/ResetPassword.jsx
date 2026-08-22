import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UtensilsCrossed, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady] = useState(false) // session de récupération détectée
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Le client Supabase détecte automatiquement le jeton de récupération
    // présent dans l'URL (envoyé par email) et l'échange contre une session
    // temporaire — on vérifie juste qu'elle existe avant d'afficher le
    // formulaire.
    supabase.auth.getSession().then(({ data }) => {
      setReady(Boolean(data.session))
    })

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') setReady(true)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les deux mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }
    setDone(true)
    setTimeout(() => navigate('/admin'), 2000)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
            <UtensilsCrossed size={20} />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Nouveau mot de passe
          </h1>
        </div>

        {done ? (
          <div className="mt-7 rounded-xl bg-accent-light p-4 text-center">
            <CheckCircle2 size={22} className="mx-auto text-accent" />
            <p className="mt-2 text-sm text-ink">Mot de passe mis à jour. Redirection…</p>
          </div>
        ) : !ready ? (
          <div className="mt-7 text-center text-sm text-muted">
            <p>
              Lien invalide ou expiré. Redemandez un lien de réinitialisation depuis la page de
              connexion.
            </p>
            <Link to="/admin/login" className="mt-3 inline-block text-sm font-medium text-accent hover:underline">
              Retour à la connexion
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Nouveau mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? 'Enregistrement…' : 'Enregistrer le nouveau mot de passe'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
