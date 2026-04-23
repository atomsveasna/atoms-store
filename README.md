# atoms.store

Technical commerce platform for Atoms smart devices.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Prisma · PostgreSQL (Supabase) · MDX docs

---

## Quick Start

### 1. Clone and install

```bash
git clone https://github.com/your-org/atoms-store.git
cd atoms-store
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# Fill in your DATABASE_URL, Supabase keys, Resend key, Telegram bot token
```

### 3. Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to your database
npm run db:studio     # Optional: open Prisma Studio
```

### 4. Run

```bash
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
atoms-store/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (fonts, metadata)
│   ├── page.tsx                # Homepage
│   ├── (shop)/
│   │   ├── shop/               # Product listing page
│   │   ├── products/[slug]/    # Product detail page
│   │   ├── cart/               # Cart
│   │   ├── checkout/           # Checkout (ABA transfer)
│   │   └── order-success/      # Order confirmation
│   ├── docs/[...slug]/         # MDX documentation system
│   ├── support/                # Support + FAQ
│   ├── about/                  # About page
│   ├── contact/                # Contact page
│   └── api/                    # API routes
│       ├── orders/             # Order creation + webhooks
│       └── products/           # Product data API
│
├── components/
│   ├── layout/                 # Header, Footer, Nav
│   ├── shop/                   # Product cards, filters, cart
│   ├── product/                # PDP tabs, specs, gallery
│   ├── docs/                   # Docs layout, sidebar, MDX renderer
│   └── ui/                     # Button, Badge, Input, Card, etc.
│
├── lib/
│   ├── utils.ts                # cn(), formatPrice(), etc.
│   ├── products.ts             # Product data (seed/static for Phase 0)
│   ├── docs.ts                 # MDX file loader
│   └── db.ts                   # Prisma client singleton
│
├── types/
│   └── index.ts                # All TypeScript types
│
├── content/
│   └── docs/
│       └── atoms-switch-1g/    # MDX docs for flagship product
│           ├── index.mdx       # Overview
│           ├── quick-start.mdx
│           ├── installation.mdx
│           ├── specifications.mdx
│           ├── api.mdx
│           └── troubleshooting.mdx
│
├── prisma/
│   └── schema.prisma           # Database schema
│
├── public/
│   └── images/
│       ├── products/           # Product photography
│       └── brand/              # Logo, favicon, brand assets
│
└── styles/
    └── globals.css             # Design tokens, base styles, components
```

---

## Phase 0 Checklist

Before launch, confirm all of these are complete:

- [ ] Real product photography in `/public/images/products/`
- [ ] All download PDFs in `/public/downloads/`
- [ ] `.env.local` filled with real values
- [ ] ABA bank transfer details confirmed
- [ ] Telegram bot connected and tested
- [ ] Shipping, warranty, and refund policies written
- [ ] Support email address active
- [ ] Domain and SSL configured on Vercel

---

## Deployment

Deploy to Vercel:

```bash
vercel deploy
```

Set all environment variables in the Vercel dashboard under Project Settings → Environment Variables.

---

## Docs System

Documentation lives in `content/docs/` as MDX files. Each file has frontmatter:

```yaml
---
title: "Page Title"
description: "Short description"
category: getting-started | installation | configuration | api | firmware | troubleshooting | downloads
productSlug: atoms-switch-1g
order: 1
lastUpdated: "2025-03-01"
---
```

Add a new product doc folder under `content/docs/your-product-slug/`.

---

## Tech Decisions

| Decision | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 App Router | SSG for docs, dynamic for shop |
| Styling | Tailwind CSS | Utility-first, fast iteration |
| Database | PostgreSQL via Supabase | Open, scalable, real-time ready |
| Docs | MDX in repo | Zero infra, Git-versioned |
| Email | Resend | Modern API, reliable delivery |
| Ops notifications | Telegram bot | Fast, zero cost, mobile-first |
| Deployment | Vercel | Zero-config Next.js hosting |
