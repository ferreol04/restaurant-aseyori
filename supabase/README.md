# Configuration Supabase

## 1. Créer le projet
1. [supabase.com](https://supabase.com) → *New project*.
2. Note le mot de passe de la base de données.
3. Attends la fin du provisionnement (~2 min).

## 2. Exécuter le schéma
Dans **SQL Editor → New query** :
1. Colle le contenu de [`schema.sql`](./schema.sql), exécute.
2. Colle le contenu de [`seed.sql`](./seed.sql), exécute (peuple le catalogue avec les 64 produits actuels).

## 3. Créer le compte de la restauratrice (admin)
**Authentication → Users → Add user** → renseigne son email + un mot de passe.
C'est ce compte qui se connectera sur `/admin/login`.

## 4. Récupérer les clés
**Project Settings → API** :
- `Project URL`
- `anon public` key

## 5. Renseigner le frontend
Crée `.env.local` à la racine du projet (copie de `.env.example`) :

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_WHATSAPP_NUMBER=229XXXXXXXX
```

Redémarre `npm run dev` après modification du `.env.local`.

## Mettre à jour le catalogue plus tard
`seed.sql` peut être ré-exécuté sans risque (`on conflict do nothing` — n'écrase pas les
modifications déjà faites depuis l'admin). Pour resynchroniser depuis `src/data/products.js`
après une modification du fichier source, regénère le seed avec le même script que celui
utilisé pour la génération initiale (transcription du menu).
