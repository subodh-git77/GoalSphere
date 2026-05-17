# Fix: @prisma/client did not initialize yet

This error appears when Prisma Client has not been generated after installing dependencies.

## Quick fix

```bash
cd goalsphere
copy .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

## If you still see the same error

Stop the dev server, delete `.next`, then run again:

```bash
rmdir /s /q .next
npx prisma generate
npm run dev
```

## PostgreSQL required

Make sure your PostgreSQL database is running and your `.env` file contains a valid `DATABASE_URL`.

Default local database URL:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/goalsphere?schema=public"
```

You can start PostgreSQL using Docker:

```bash
docker compose up -d db
```

Then run:

```bash
npx prisma db push
npm run seed
npm run dev
```
