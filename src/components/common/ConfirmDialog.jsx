import { AlertTriangle } from 'lucide-react'
import ModalPortal from './ModalPortal'

/**
 * Boîte de confirmation stylée, à la place de window.confirm() (popup brute
 * du navigateur). Rendue uniquement quand une suppression est en attente —
 * voir les pages admin pour le pattern d'utilisation (état `pendingDelete`).
 */
export default function ConfirmDialog({
  title = 'Confirmer la suppression',
  message,
  confirmLabel = 'Supprimer',
  onConfirm,
  onCancel,
}) {
  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex transform-gpu items-center justify-center bg-ink/55 p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm animate-[slide-up_0.25s_ease-out] rounded-3xl bg-surface p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={22} />
        </span>
        <h2 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{message}</p>

        <div className="mt-6 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-full bg-bg py-2.5 text-sm font-medium text-ink transition-colors hover:bg-border"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-full bg-red-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  )
}
