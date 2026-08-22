import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Variables Supabase manquantes : renseignez VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY dans un fichier .env.local'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

const PRODUCT_IMAGES_BUCKET = 'product-images'

/** Extrait le chemin de stockage d'une URL publique Supabase Storage. */
function extractStoragePath(publicUrl, bucket) {
  if (!publicUrl) return null
  const marker = `/${bucket}/`
  const index = publicUrl.indexOf(marker)
  return index === -1 ? null : publicUrl.slice(index + marker.length)
}

/**
 * Supprime un fichier du bucket "product-images" à partir de son URL
 * publique. Utilisé pour nettoyer le stockage quand une photo produit est
 * remplacée ou retirée. Échec silencieux (juste loggé) : ne doit jamais
 * bloquer l'action principale (enregistrement/suppression du produit).
 */
export async function deleteProductImage(publicUrl) {
  const path = extractStoragePath(publicUrl, PRODUCT_IMAGES_BUCKET)
  if (!path) return
  const { error } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).remove([path])
  if (error) console.warn("Échec de la suppression de l'ancienne image :", error.message)
}
