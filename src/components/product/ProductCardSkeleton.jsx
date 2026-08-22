import Skeleton from '../common/Skeleton'

/** Reproduit la forme de ProductCard pendant le chargement du catalogue. */
export default function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-soft">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-3.5">
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-3 flex items-center justify-between">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}
