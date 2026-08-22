/**
 * Redimensionne et compresse une image côté navigateur avant envoi vers
 * Supabase Storage — une photo de smartphone (plusieurs Mo, 4000px+) n'a
 * jamais besoin d'être plus grande que ce qu'affiche le site (~340-380px).
 * Réduit le poids envoyé de plusieurs Mo à quelques dizaines de Ko, sans
 * perte visible à ces tailles d'affichage.
 *
 * @param {File} file - image d'origine sélectionnée par l'utilisateur
 * @param {number} maxDimension - largeur/hauteur max en pixels
 * @param {number} quality - qualité JPEG (0-1)
 * @returns {Promise<File>} image optimisée, prête à uploader
 */
export async function optimizeImage(file, { maxDimension = 1000, quality = 0.85 } = {}) {
  const bitmap = await createImageBitmap(file).catch(() => null)
  if (!bitmap) return file // format non supporté par le navigateur : on envoie l'original

  const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality)
  )
  if (!blob) return file // conversion échouée : on envoie l'original par sécurité

  const optimizedName = file.name.replace(/\.[^.]+$/, '') + '.jpg'
  return new File([blob], optimizedName, { type: 'image/jpeg' })
}
