-- Corrige un oubli : la table "messages" n'avait jamais été ajoutée à la
-- publication Realtime, contrairement aux autres (products, categories,
-- restaurant_settings...). Résultat : l'abonnement temps réel d'Admin →
-- Messages ne se déclenchait jamais — un nouveau message n'apparaissait
-- qu'après un rechargement complet de la page.

alter publication supabase_realtime add table messages;
