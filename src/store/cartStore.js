import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Un article de panier est identifié par productId + price (un même produit
// peut être ajouté deux fois avec des prix différents s'il propose plusieurs formats).
function makeLineId(productId, price) {
  return `${productId}__${price}`
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      // État d'ouverture du Cart Drawer — piloté depuis n'importe quel
      // composant (header, bandeau flottant, footer…) sans prop drilling,
      // et volontairement exclu de la persistance (voir `partialize`
      // ci-dessous) : rouvrir le panier au chargement de la page surprendrait
      // l'utilisateur.
      isDrawerOpen: false,
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      addItem: (product, price, quantity = 1) => {
        const lineId = makeLineId(product.id, price)
        const existing = get().items.find((item) => item.lineId === lineId)

        if (existing) {
          set({
            items: get().items.map((item) =>
              item.lineId === lineId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [
              ...get().items,
              {
                lineId,
                productId: product.id,
                name: product.name,
                image: product.image,
                price,
                quantity,
              },
            ],
          })
        }
      },

      updateQuantity: (lineId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(lineId)
          return
        }
        set({
          items: get().items.map((item) =>
            item.lineId === lineId ? { ...item, quantity } : item
          ),
        })
      },

      removeItem: (lineId) => {
        set({ items: get().items.filter((item) => item.lineId !== lineId) })
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'restaurant-cart',
      // Seuls les articles sont persistés : l'état d'ouverture du drawer
      // ne doit pas survivre à un rechargement de page.
      partialize: (state) => ({ items: state.items }),
    }
  )
)
