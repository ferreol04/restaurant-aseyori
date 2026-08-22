-- Correctif : l'insertion publique dans "messages" est refusée par RLS.
-- Recrée la policy proprement et s'assure des droits de base (GRANT),
-- indépendants des policies RLS.

alter table messages enable row level security;

drop policy if exists "messages_public_insert" on messages;
create policy "messages_public_insert" on messages
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "messages_admin_read" on messages;
create policy "messages_admin_read" on messages
  for select
  to authenticated
  using (true);

drop policy if exists "messages_admin_delete" on messages;
create policy "messages_admin_delete" on messages
  for delete
  to authenticated
  using (true);

grant usage on schema public to anon, authenticated;
grant insert on messages to anon, authenticated;
grant select, delete on messages to authenticated;
