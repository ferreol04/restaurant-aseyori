-- Ajoute une description propre à chaque prix d'un produit (ex : "Petite
-- portion" pour 500f, "Grande portion" pour 1000f), affichée dans le modal
-- de détail quand le client change de prix. Tableau aligné index par index
-- avec la colonne "prices" déjà existante.

alter table products
  add column if not exists price_descriptions text[] not null default '{}';
