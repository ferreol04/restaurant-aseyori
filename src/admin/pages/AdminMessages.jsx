import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { useMessagesStore } from '../../store/messagesStore'
import { usePagination } from '../../hooks/usePagination'
import Pagination from '../../components/common/Pagination'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Skeleton from '../../components/common/Skeleton'

const PAGE_SIZE = 10

function formatDate(iso) {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function AdminMessages() {
  const messages = useMessagesStore((state) => state.messages)
  const loading = useMessagesStore((state) => state.loading)
  const ensureLoaded = useMessagesStore((state) => state.ensureLoaded)

  const [page, setPage] = useState(1)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    ensureLoaded()
  }, [ensureLoaded])

  async function confirmDelete() {
    await supabase.from('messages').delete().eq('id', pendingDelete.id)
    setPendingDelete(null)
    // Le cache se met à jour automatiquement via l'abonnement Realtime.
    setPage(1)
  }

  const { page: safePage, totalPages, pageItems } = usePagination(messages, page, PAGE_SIZE)

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-ink">
        Appréciations et suggestions <span className="text-muted">({messages.length})</span>
      </h2>

      {loading ? (
        <ul className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="rounded-2xl border border-border bg-surface p-5 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
            </li>
          ))}
        </ul>
      ) : messages.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Aucun message pour le moment.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {pageItems.map((message) => (
            <li
              key={message.id}
              className="rounded-2xl border border-border bg-surface p-5 shadow-soft"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">{message.name || 'Anonyme'}</p>
                  <p className="text-xs text-muted">{formatDate(message.created_at)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPendingDelete(message)}
                  aria-label="Supprimer"
                  className="rounded-full p-2 text-muted hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink">{message.message}</p>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={safePage} totalPages={totalPages} onPageChange={setPage} />

      {pendingDelete && (
        <ConfirmDialog
          message={`Supprimer le message de « ${pendingDelete.name || 'Anonyme'} » ? Cette action est définitive.`}
          onConfirm={confirmDelete}
          onCancel={() => setPendingDelete(null)}
        />
      )}
    </div>
  )
}
