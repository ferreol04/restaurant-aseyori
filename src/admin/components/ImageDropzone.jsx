import { useRef, useState } from 'react'
import { ImagePlus, RefreshCw, X } from 'lucide-react'

/**
 * Zone d'upload d'image façon site moderne : cliquer ou glisser-déposer pour
 * ajouter une photo ; au survol d'une photo déjà présente, deux actions
 * apparaissent (changer / supprimer) directement sur l'image.
 */
export default function ImageDropzone({ previewUrl, onSelectFile, onRemove }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  function handleFiles(fileList) {
    const file = fileList?.[0]
    if (file && file.type.startsWith('image/')) {
      onSelectFile(file)
    }
    // Permet de resélectionner le même fichier après une suppression.
    if (inputRef.current) inputRef.current.value = ''
  }

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {previewUrl ? (
        <div className="group relative aspect-square w-36 overflow-hidden rounded-xl border border-border">
          <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink/55 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Changer la photo"
              title="Changer la photo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink hover:bg-white/90"
            >
              <RefreshCw size={16} />
            </button>
            <button
              type="button"
              onClick={onRemove}
              aria-label="Supprimer la photo"
              title="Supprimer la photo"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-600 hover:bg-white/90"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex aspect-square w-36 flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed text-center transition-colors ${
            isDragging
              ? 'border-accent bg-accent-light'
              : 'border-border bg-bg hover:border-accent hover:bg-accent-light'
          }`}
        >
          <ImagePlus size={20} className="text-accent" />
          <span className="px-3 text-xs leading-snug text-muted">
            <span className="font-medium text-accent">Cliquez</span> ou glissez
          </span>
        </button>
      )}
    </div>
  )
}
