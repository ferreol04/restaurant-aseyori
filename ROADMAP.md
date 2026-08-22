# Feuille de route — Site Restaurant

Suivi des modules restants, dans l'ordre d'exécution. Coché = fait et vérifié (build/lint).

- [x] **M0 — Socle** : structure du projet, Router, Zustand (panier), Tailwind, dépendances
- [x] **M1 — Catalogue (données)** : transcription du menu, palette de couleurs, Supabase (schéma + seed)
- [x] **M2 — Catalogue (branchement Supabase)** : la page Menu lit les produits/catégories depuis Supabase au lieu du fichier statique
- [x] **M3 — Tunnel de commande** : Panier → choix du mode (livraison/retrait/sur place) → génération du message → lien `wa.me`
- [x] **M4 — Accueil** : bannière carrousel, présentation, produits phares, infos pratiques
- [x] **M5 — Contact** : coordonnées, carte Google Maps, bouton WhatsApp, formulaire appréciations → Supabase (⚠️ policy RLS `messages` à corriger, voir supabase/fix-messages-policy.sql)
- [x] **M6 — Visite guidée** : tooltips au premier chargement, bouton "Passer"
- [x] **M7 — Admin : catalogue** : CRUD produits/catégories/sous-catégories + upload d'images (Supabase Storage)
- [x] **M8 — Admin : messages clients** : liste des appréciations/suggestions, suppression
- [ ] **M9 — Finitions & déploiement** : vérifications finales, README de déploiement Vercel (⏸ en attente de ton feu vert)

Chaque module est livré, testé (`npm run build` + `npm run lint`), puis coché avant de passer au suivant.
