-- Numéro WhatsApp qui reçoit les commandes — éditable depuis l'admin, pour
-- ne plus dépendre d'une variable d'environnement figée au déploiement.

alter table restaurant_settings
  add column if not exists whatsapp_number text not null default '';

-- Reprend la valeur actuelle du .env comme valeur de départ, si elle existe.
-- (Remplace la valeur ci-dessous par le numéro déjà configuré si besoin,
-- ou laisse vide et renseigne-le directement depuis l'admin.)
-- update restaurant_settings set whatsapp_number = '229...' where id = 'main';
