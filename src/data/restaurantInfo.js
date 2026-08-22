// Identité du restaurant (nom, présentation). L'adresse, les horaires et la
// position sont désormais éditables depuis l'admin (Réglages → Lieu &
// horaires) et stockées dans Supabase — voir hooks/useRestaurantSettings.js.
export const RESTAURANT_INFO = {
  name: 'ÀṢEYỌRÍ',
  tagline: 'Cuisine locale généreuse, du petit déjeuner au dessert',
  intro:
    "Un lieu chaleureux où l'on se retrouve autour d'une cuisine simple et copieuse : petit déjeuner, plats de résistance, grignotines, boissons et desserts, à emporter, en livraison ou à consommer sur place.",
}

// Produits mis en avant sur l'Accueil (§3.1) — ids issus du catalogue.
export const FEATURED_PRODUCT_IDS = ['chawarma', 'riz-gras-creole-frite-aloco', 'jus-bissap', 'degue-arachide']
