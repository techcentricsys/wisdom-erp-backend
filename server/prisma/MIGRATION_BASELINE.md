# Prisma Migration Baseline

`20261114000000_baseline` captures the Wisdom ERP schema from `main` immediately before the Inquiry migrations. It supplies the pre-existing tables and enums that the Inquiry migrations reference, so Prisma can replay the complete history in a fresh database and in its shadow database.

## Fresh database

Run `npx prisma migrate deploy` from `server`. This applies the baseline followed by the Inquiry migrations.

## Existing database

Do not apply the baseline SQL to a database that already has the baseline tables: it would attempt to create them again. First confirm that the database already contains the schema represented by this baseline and that any later migrations recorded in `_prisma_migrations` are present. Then mark only the baseline as already applied, without executing its SQL:

```powershell
npx prisma migrate resolve --applied 20261114000000_baseline
npx prisma migrate deploy
```

Run this adoption step once per existing database, using that environment's approved database connection. If the baseline schema is incomplete or uncertain, stop and compare the database schema before marking it applied.