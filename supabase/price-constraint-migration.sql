-- Empêche l'enregistrement d'un prix négatif ou nul, y compris en écriture
-- directe via l'API (contournant le formulaire admin). Jusqu'ici, seule la
-- validation côté formulaire empêchait ça — un appel API direct avec la
-- bonne session pouvait insérer prices = [0] ou [-500].

alter table products
  add constraint products_prices_positive check (0 < all(prices));
