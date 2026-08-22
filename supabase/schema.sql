-- Schéma initial — Site Restaurant
-- À coller dans l'éditeur SQL de Supabase (Project → SQL Editor → New query),
-- puis exécuter. Ensuite exécuter supabase/seed.sql pour peupler le catalogue.

-- ============================================================
-- Catégories
-- ============================================================
create table if not exists categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0
);

-- ============================================================
-- Sous-catégories (ex: sous Boissons)
-- ============================================================
create table if not exists subcategories (
  id text primary key,
  category_id text not null references categories(id) on delete cascade,
  name text not null,
  sort_order integer not null default 0
);

-- ============================================================
-- Produits
-- ============================================================
create table if not exists products (
  id text primary key,
  category_id text not null references categories(id) on delete restrict,
  subcategory_id text references subcategories(id) on delete set null,
  name text not null,
  description text not null default '',
  image_url text,
  -- un seul prix ([1500]) ou plusieurs prix au choix du client ([1500, 2000])
  prices integer[] not null check (array_length(prices, 1) > 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Appréciations et suggestions (formulaire page Contact, §7)
-- ============================================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  name text,
  message text not null,
  created_at timestamptz not null default now()
);

-- ============================================================
-- Sécurité (Row Level Security)
-- Règle générale : catalogue lisible par tout le monde, écriture
-- réservée aux utilisateurs authentifiés (= la restauratrice, via
-- Supabase Auth). Les messages clients sont insérables par tous
-- mais lisibles uniquement par un utilisateur authentifié.
-- ============================================================

alter table categories enable row level security;
alter table subcategories enable row level security;
alter table products enable row level security;
alter table messages enable row level security;

-- Catégories : lecture publique, écriture admin
create policy "categories_public_read" on categories
  for select using (true);
create policy "categories_admin_write" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Sous-catégories : lecture publique, écriture admin
create policy "subcategories_public_read" on subcategories
  for select using (true);
create policy "subcategories_admin_write" on subcategories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Produits : lecture publique, écriture admin
create policy "products_public_read" on products
  for select using (true);
create policy "products_admin_write" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- Messages : n'importe qui peut envoyer un message, seul l'admin peut les lire/gérer
create policy "messages_public_insert" on messages
  for insert with check (true);
create policy "messages_admin_read" on messages
  for select using (auth.role() = 'authenticated');
create policy "messages_admin_delete" on messages
  for delete using (auth.role() = 'authenticated');

-- ============================================================
-- Stockage des images produits (Supabase Storage, §9.1)
-- Bucket public en lecture, upload réservé à l'admin.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "product_images_admin_write" on storage.objects
  for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "product_images_admin_update" on storage.objects
  for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "product_images_admin_delete" on storage.objects
  for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

-- ============================================================
-- Mise à jour en temps réel du catalogue public (§9.1)
-- ============================================================
alter publication supabase_realtime add table products;
alter publication supabase_realtime add table categories;
alter publication supabase_realtime add table subcategories;
