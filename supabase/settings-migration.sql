-- Réglages du restaurant (adresse, horaires, position) — éditables depuis
-- l'admin, pour ne plus dépendre d'une valeur codée en dur si le restaurant
-- déménage. Une seule ligne ("main"). La position est capturée directement
-- via géolocalisation dans l'admin (pas de lien à copier-coller).

create table if not exists restaurant_settings (
  id text primary key default 'main',
  address text not null default '',
  hours_text text not null default '',
  latitude double precision,
  longitude double precision,
  updated_at timestamptz not null default now()
);

insert into restaurant_settings (id, address, hours_text)
values ('main', 'Adresse à renseigner', 'Tous les jours — 8h00 à 22h00')
on conflict (id) do nothing;

alter table restaurant_settings enable row level security;

drop policy if exists "restaurant_settings_public_read" on restaurant_settings;
create policy "restaurant_settings_public_read" on restaurant_settings
  for select using (true);

drop policy if exists "restaurant_settings_admin_write" on restaurant_settings;
create policy "restaurant_settings_admin_write" on restaurant_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

alter publication supabase_realtime add table restaurant_settings;
