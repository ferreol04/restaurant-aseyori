import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { forcePageRepaint } from '../../lib/forceRepaint'

/**
 * Fait sortir une fenêtre modale de l'arborescence normale de la page pour
 * l'ajouter directement à la racine du document (document.body), hors de
 * tout contexte d'empilement de la page. Bonne pratique standard pour toute
 * fenêtre modale.
 *
 * On force aussi un repaint juste après l'ouverture — voir forceRepaint.js
 * pour le détail du bug ciblé (affichage qui reste bloqué tant qu'un
 * défilement réel n'a pas eu lieu, observé sur iPhone).
 */
export default function ModalPortal({ children }) {
  useEffect(() => {
    forcePageRepaint()
  }, [])

  return createPortal(children, document.body)
}
