import { useEffect, useMemo, useState } from 'react'
import { X, Plus, Trash2 } from 'lucide-react'
import { supabase, deleteProductImage } from '../../lib/supabase'
import { optimizeImage } from '../../lib/imageOptimize'
import ImageDropzone from './ImageDropzone'
import ModalPortal from '../../components/common/ModalPortal'

function buildInitialPriceRows(product) {
  if (product?.prices?.length) {
    return product.prices.map((amount, i) => ({
      amount: String(amount),
      description: product.price_descriptions?.[i] ?? '',
    }))
  }
  return [{ amount: '', description: '' }]
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // retire les accents (é → e, etc.)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function ProductForm({ product, categories, onClose, onSaved }) {
  const isEditing = Boolean(product)

  const [name, setName] = useState(product?.name ?? '')
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? '')
  const [subcategoryId, setSubcategoryId] = useState(product?.subcategory_id ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [priceRows, setPriceRows] = useState(() => buildInitialPriceRows(product))
  const [imageFile, setImageFile] = useState(null)
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Référence figée de l'image telle qu'elle était à l'ouverture du
  // formulaire — sert à savoir, après enregistrement, s'il faut nettoyer
  // l'ancien fichier du Storage (remplacement ou retrait de la photo).
  const [originalImageUrl] = useState(product?.image_url ?? '')

  const currentCategory = categories.find((c) => c.id === categoryId)
  const subcategories = currentCategory?.subcategories ?? []

  // Aperçu local du fichier sélectionné (glissé-déposé ou choisi via le
  // sélecteur), sinon l'image déjà enregistrée pour ce produit.
  const previewUrl = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile)
    return imageUrl
  }, [imageFile, imageUrl])

  // Libère l'URL locale créée pour l'aperçu, pour éviter les fuites mémoire.
  useEffect(() => {
    if (!imageFile) return
    return () => URL.revokeObjectURL(previewUrl)
  }, [imageFile, previewUrl])

  function handleRemoveImage() {
    setImageFile(null)
    setImageUrl('')
  }

  function updatePriceRow(index, field, value) {
    setPriceRows((rows) => rows.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  function addPriceRow() {
    setPriceRows((rows) => [...rows, { amount: '', description: '' }])
  }

  function removePriceRow(index) {
    setPriceRows((rows) => (rows.length > 1 ? rows.filter((_, i) => i !== index) : rows))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const validRows = priceRows.filter((row) => row.amount.trim() !== '')
    const prices = validRows.map((row) => Number(row.amount))
    const priceDescriptions = validRows.map((row) => row.description.trim())

    if (!name.trim()) return setError('Le nom est obligatoire.')
    if (!categoryId) return setError('Choisissez une catégorie.')
    if (prices.length === 0 || prices.some((p) => !Number.isFinite(p) || p <= 0)) {
      return setError('Renseignez un prix valide pour chaque ligne.')
    }

    setSaving(true)

    let finalImageUrl = imageUrl
    if (imageFile) {
      const optimizedFile = await optimizeImage(imageFile)
      const path = `${Date.now()}-${slugify(optimizedFile.name)}`
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(path, optimizedFile, { upsert: true })

      if (uploadError) {
        setError(`Échec de l'envoi de l'image : ${uploadError.message}`)
        setSaving(false)
        return
      }
      finalImageUrl = supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
    }

    const payload = {
      category_id: categoryId,
      subcategory_id: subcategoryId || null,
      name: name.trim(),
      description: description.trim(),
      prices,
      price_descriptions: priceDescriptions,
      image_url: finalImageUrl || null,
    }

    const { error: saveError } = isEditing
      ? await supabase.from('products').update(payload).eq('id', product.id)
      : await supabase.from('products').insert({ id: slugify(name), ...payload })

    setSaving(false)

    if (saveError) {
      setError(saveError.message)
      return
    }

    // Photo remplacée ou retirée : l'ancien fichier n'est plus référencé
    // par aucun produit, on le supprime du Storage.
    if (originalImageUrl && originalImageUrl !== (finalImageUrl || null)) {
      deleteProductImage(originalImageUrl)
    }

    onSaved()
  }

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-50 flex transform-gpu items-end justify-center bg-ink/55 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-lg animate-[slide-up_0.25s_ease-out] overflow-y-auto rounded-t-3xl bg-surface sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-semibold text-ink">
            {isEditing ? 'Modifier le produit' : 'Nouveau produit'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-bg"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-6">
          <div>
            <label className="block text-sm font-medium text-ink">Nom</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-ink">Catégorie</label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value)
                  setSubcategoryId('')
                }}
                className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {subcategories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-ink">Sous-catégorie</label>
                <select
                  value={subcategoryId}
                  onChange={(e) => setSubcategoryId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
                >
                  <option value="">—</option>
                  {subcategories.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">
              Description générale <span className="font-normal text-muted">— facultatif</span>
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Présentation générale du plat."
              className="mt-1.5 w-full rounded-xl border border-border bg-bg px-3.5 py-2.5 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-ink">Prix</label>
              <button
                type="button"
                onClick={addPriceRow}
                className="flex items-center gap-1 text-xs font-medium text-accent hover:underline"
              >
                <Plus size={13} /> Ajouter un prix
              </button>
            </div>
            <p className="mt-0.5 text-xs text-muted">
              Un seul prix, ou plusieurs avec une description propre à chacun (ex : "Petite
              portion" pour 500f) — affichée quand le client change de prix dans le détail produit.
            </p>

            <div className="mt-2.5 space-y-2">
              {priceRows.map((row, index) => (
                <div key={index} className="flex flex-wrap gap-2">
                  <input
                    type="number"
                    min="0"
                    value={row.amount}
                    onChange={(e) => updatePriceRow(index, 'amount', e.target.value)}
                    placeholder="Prix (f)"
                    className="w-24 rounded-xl border border-border bg-bg px-3 py-2 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light sm:w-28"
                  />
                  <input
                    type="text"
                    value={row.description}
                    onChange={(e) => updatePriceRow(index, 'description', e.target.value)}
                    placeholder={priceRows.length > 1 ? 'Ex : Petite portion' : 'Description — facultatif'}
                    className="min-w-40 flex-1 rounded-xl border border-border bg-bg px-3 py-2 text-sm transition-colors focus:border-accent focus:bg-surface focus:outline-none focus:ring-2 focus:ring-accent-light"
                  />
                  <button
                    type="button"
                    onClick={() => removePriceRow(index)}
                    disabled={priceRows.length === 1}
                    aria-label="Retirer ce prix"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink">Photo</label>
            <p className="mt-0.5 text-xs text-muted">
              Idéalement carrée. Redimensionnée et compressée automatiquement à l'envoi, quelle
              que soit la taille du fichier d'origine.
            </p>
            <div className="mt-2">
              <ImageDropzone
                previewUrl={previewUrl}
                onSelectFile={setImageFile}
                onRemove={handleRemoveImage}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-full bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-60"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </form>
      </div>
    </div>
    </ModalPortal>
  )
}
