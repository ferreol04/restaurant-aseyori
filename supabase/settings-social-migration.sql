-- Ajoute les liens de réseaux sociaux à restaurant_settings (déjà créée par
-- settings-migration.sql). À exécuter une fois dans le SQL Editor Supabase.

alter table restaurant_settings
  add column if not exists facebook_url text not null default '',
  add column if not exists instagram_url text not null default '',
  add column if not exists tiktok_url text not null default '',
  add column if not exists linkedin_url text not null default '';
