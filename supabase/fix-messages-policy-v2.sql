-- Correctif v2 : la restriction "to anon, authenticated" du premier correctif
-- ne correspond probablement pas au rôle Postgres réellement utilisé par les
-- nouvelles clés API Supabase (sb_publishable_...). On aligne "messages" sur
-- le même style que les policies de lecture du catalogue, qui fonctionnent
-- (pas de clause "to", donc appliquées à PUBLIC = tous les rôles).

drop policy if exists "messages_public_insert" on messages;
create policy "messages_public_insert" on messages
  for insert
  with check (true);

drop policy if exists "messages_admin_read" on messages;
create policy "messages_admin_read" on messages
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "messages_admin_delete" on messages;
create policy "messages_admin_delete" on messages
  for delete
  using (auth.role() = 'authenticated');

-- Garantit les droits de base pour tous les rôles (déjà posé par le premier
-- correctif, sans effet si déjà en place).
grant usage on schema public to anon, authenticated;
grant insert on messages to anon, authenticated;
grant select, delete on messages to authenticated;
