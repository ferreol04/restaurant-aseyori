-- Impose une limite de taille et de format sur le bucket "product-images",
-- au niveau de Supabase Storage lui-même — protection valable peu importe
-- comment l'upload est envoyé (formulaire admin, script, appel API direct),
-- pas seulement via la validation côté navigateur.

update storage.buckets
set file_size_limit = 5242880, -- 5 Mo
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'product-images';
