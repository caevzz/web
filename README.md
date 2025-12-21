# ZyrooNour Monorepo (1 repo, many hostings)

Folder:
- `apps/web-next`   → Next.js (recommended for **Vercel**)
- `apps/web-static` → Static HTML (recommended for **Netlify / Cloudflare Pages / GitHub Pages / any hosting**)

## 1) Install
```bash
npm install
```

## 2) Run locally
- Next.js:
  ```bash
  npm run dev:next
  ```
  open http://localhost:3000

- Static:
  ```bash
  npm run dev:static
  ```
  open http://localhost:5173

## Deploy matrix

### A) Vercel (Next.js)
Create a new Vercel project → Import repo → set:
- **Root Directory**: `apps/web-next`
- Framework: Next.js (auto)
- Build command: default
Deploy ✅

### B) Netlify (Static)
Create site → Import repo → set:
- **Base directory**: `apps/web-static`
- **Build command**: (empty)
- **Publish directory**: `apps/web-static`
Deploy ✅

If you use *Deploy manually* in Netlify, upload the content of `apps/web-static` (or zip it).

### C) Cloudflare Pages (Static)
Create project → Connect repo → set:
- **Root directory**: `apps/web-static`
- Build command: (empty)
- Output directory: `/` or leave empty
Deploy ✅

### D) GitHub Pages (Static)
Use `apps/web-static` as the publishing folder (or deploy it with actions).

## Replace images
- Static:
  - `apps/web-static/assets/images/cover.jpg`
  - `apps/web-static/assets/images/avatar.jpg`

- Next.js:
  - `apps/web-next/public/images/cover.jpg`
  - `apps/web-next/public/images/avatar.jpg`
