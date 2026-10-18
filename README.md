# Modiecommers — Frontend Storefront & Admin Portal

Modern React & TypeScript storefront for **Modiecommers**, a luxury fine jewellery and solitaire e-commerce brand.

## Key Features

- **Storefront & Discovery**: Curated fine jewellery catalogue, categories (Rings, Necklaces, Earrings, Bracelets, Pendants), bridal suites, advanced search, filtering, and rich product detail pages.
- **Cart & Wishlist**: Real-time sliding drawer cart, guest checkout session preservation, and personalized wishlists.
- **Patron Authentication**: Multi-step registration with email verification OTP, role-based login, and 4-step secure password recovery with time-limited OTPs.
- **Integrated Admin Portal**: Comprehensive management interface directly embedded within the store layout for inventory, orders, customer accounts, and promotions.
- **Brand Aesthetics**: Luxury visual language using warm ivory palettes, deep emerald greens, subtle gold accents, and Playfair Display serif typography.
- **Full Responsiveness**: Optimized for mobile, tablet, and high-resolution desktop viewports.

## Tech Stack

- **Framework**: React 19 & TypeScript
- **Bundler & Tooling**: Vite 8
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router 7
- **API Communication**: REST client with automatic JWT token refresh

## Getting Started

### 1. Prerequisites

- Node.js (v18+)
- npm (v9+)

### 2. Installation

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

### 3. Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend instance (default: `http://localhost:8000/api/v1`).

### 4. Running the Development Server

```bash
npm run dev
```

The web application will launch at `http://localhost:5173/`.

### 5. Production Build

```bash
npm run build
```

## Render Static Site Deployment & SPA Routing

When deploying to Render as a **Static Site**:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`

### SPA Rewrites for Page Refreshes & Nested Routes
Single Page Applications (SPAs) require all route requests to be rewritten to `/index.html` so React Router can handle routing on the client side:
- **Automatic via `_redirects`**: The [`public/_redirects`](public/_redirects) file is automatically copied to `dist/_redirects` during `npm run build` with the rule:
  ```text
  /*    /index.html   200
  ```
- **Render Dashboard Settings**: Under your Static Site in Render, go to **Redirects/Rewrites** and verify or add:
  - **Source**: `/*`
  - **Destination**: `/index.html`
  - **Action**: `Rewrite`

This ensures that refreshing or directly opening nested URLs (e.g. `/login`, `/register`, `/catalogue`, `/product/:slug`, `/cart`, `/checkout`, `/account`, and `/admin/*`) serves `index.html` with status 200 rather than a 404 error.
