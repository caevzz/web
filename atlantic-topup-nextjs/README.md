# Atlantic Topup (Codashop-style) — Next.js template

## What this is
A minimal, safe template:
- Frontend: pick product (price list), input target, pay via QRIS deposit, then auto-topup after PAID.
- Backend: Next.js API routes (server-side) keeps your Atlantic API key secret.

## Setup
1) Install deps
```bash
npm i
```

2) Copy env
```bash
cp .env.example .env
```
Fill `ATLANTIC_API_KEY` (DO NOT put it in frontend code).

3) Run
```bash
npm run dev
```

Open http://localhost:3000

## Important notes (production)
- This template stores orders in memory (for simplicity). In production you MUST use a DB (Postgres/MySQL/Redis).
- If you deploy to serverless, memory resets on cold starts. Replace `lib/store.js` with real DB storage.
