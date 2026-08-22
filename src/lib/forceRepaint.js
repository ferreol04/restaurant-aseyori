/**
 * Force un vrai repaint de la page en reproduisant, en JavaScript, le geste
 * de défilement manuel qui résout de façon fiable un bug d'affichage
 * observé sur certains iPhone (Safari et navigateurs iOS, qui partagent le
 * même moteur WebKit) : après un changement déclenché par un tap (ex : une
 * catégorie qui devient active, une fenêtre modale qui s'ouvre), le
 * navigateur ne repeint pas toujours l'écran tant qu'un défilement réel n'a
 * pas eu lieu. Un minuscule décalage vertical (1px, imperceptible),
 * appliqué puis annulé sur deux images d'animation distinctes pour
 * garantir un vrai repaint entre les deux, débloque ce même rendu.
 */
export function forcePageRepaint() {
  window.scrollBy(0, 1)
  requestAnimationFrame(() => {
    window.scrollBy(0, -1)
  })
}
