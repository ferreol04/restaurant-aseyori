import { useState } from 'react'
import { UtensilsCrossed, Mail } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

const inputClass =
  'mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light'

export default function Login() {
  const [mode, setMode] = useState('login') // 'login' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    navigate('/admin')
  }

  async function handleResetRequest(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin/reinitialiser-mot-de-passe`,
    })
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
      return
    }
    setResetSent(true)
  }

  function switchMode(nextMode) {
    setMode(nextMode)
    setError('')
    setResetSent(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm rounded-3xl border border-border bg-surface p-8 shadow-soft">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white">
            <UtensilsCrossed size={20} />
          </span>
          <h1 className="mt-4 font-display text-xl font-semibold text-ink">
            Espace administration
          </h1>
          <p className="mt-1 text-sm text-muted">
            {mode === 'login'
              ? 'Connectez-vous pour gérer le catalogue.'
              : 'Recevez un lien pour redéfinir votre mot de passe.'}
          </p>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleSubmit} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Mot de passe</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="mt-1.5 block w-full text-right text-xs font-medium text-accent hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        ) : resetSent ? (
          <div className="mt-7 rounded-xl bg-accent-light p-4 text-center">
            <Mail size={22} className="mx-auto text-accent" />
            <p className="mt-2 text-sm text-ink">
              Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation vient
              d'être envoyé. Vérifiez votre boîte mail (et vos spams).
            </p>
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="mt-3 text-sm font-medium text-accent hover:underline"
            >
              Retour à la connexion
            </button>
          </div>
        ) : (
          <form onSubmit={handleResetRequest} className="mt-7 space-y-4">
            <div>
              <label className="text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-accent py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
            >
              {loading ? 'Envoi…' : 'Envoyer le lien'}
            </button>
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="w-full text-sm text-muted hover:text-ink"
            >
              Retour à la connexion
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
