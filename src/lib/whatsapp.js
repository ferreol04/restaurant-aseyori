// Numéro WhatsApp de secours (variable d'environnement), utilisé uniquement
// si aucun numéro n'a encore été configuré depuis l'admin (Réglages → Lieu,
// horaires & réseaux). Le numéro réel vient de restaurant_settings.whatsapp_number,
// modifiable à tout moment sans redéploiement — voir useRestaurantSettings().
export const RESTAURANT_WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

/**
 * Construit le message texte de la commande à partir du panier et des infos du tunnel de commande.
 * @param {Array} items - articles du panier [{ name, quantity, price }]
 * @param {number} total - total général de la commande
 * @param {'delivery'|'pickup'|'dine-in'} mode - mode de récupération
 * @param {object} details - infos associées au mode choisi (phone, locationText, locationLink, arrivalTime)
 * @param {string} note - note globale de commande (facultative)
 */
export function buildOrderMessage({ items, total, mode, details, note }) {
  const lines = []

  lines.push('*Nouvelle commande*')
  lines.push('')
  items.forEach((item) => {
    const subtotal = item.price * item.quantity
    lines.push(`• ${item.name} x${item.quantity} — ${item.price} f (sous-total ${subtotal} f)`)
  })
  lines.push('')
  lines.push(`*Total : ${total} f*`)
  lines.push('')

  if (mode === 'delivery') {
    lines.push('*Mode : Livraison*')
    if (details?.phone) lines.push(`Téléphone : ${details.phone}`)
    if (details?.locationLink) lines.push(`Position : ${details.locationLink}`)
    else if (details?.locationText) lines.push(`Adresse : ${details.locationText}`)
  } else if (mode === 'pickup') {
    lines.push('*Mode : Retrait sur place*')
    if (details?.phone) lines.push(`Téléphone : ${details.phone}`)
  } else if (mode === 'dine-in') {
    lines.push('*Mode : Manger sur place*')
    if (details?.phone) lines.push(`Téléphone : ${details.phone}`)
    if (details?.arrivalTime) lines.push(`Heure d'arrivée : ${details.arrivalTime}`)
  }

  if (note) {
    lines.push('')
    lines.push(`Note : ${note}`)
  }

  return lines.join('\n')
}

export function buildWhatsAppLink(message, number = RESTAURANT_WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
