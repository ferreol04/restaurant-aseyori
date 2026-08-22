/**
 * Construit une URL de carte Google Maps intégrable (iframe), sans clé API,
 * à partir d'une position GPS.
 */
export function buildMapEmbedUrl(latitude, longitude) {
  if (latitude == null || longitude == null) return ''
  return `https://www.google.com/maps?q=${latitude},${longitude}&z=16&output=embed`
}
