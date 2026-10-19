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
Single Page Applications (SPAs) require all route requests to be rewritten to `/index.html` so React Router can handle client-side routing on page refresh:
- **Render Dashboard Settings (Required for Existing Static Sites)**:
  1. Open your Render Dashboard and select `modi-e-commerce`.
  2. In the left navigation, click **Redirects / Rewrites** (or **Settings** > **Redirects and Rewrites**).
  3. Click **Add Rule**:
     - **Type**: `Rewrite`
     - **Source**: `/*`
     - **Destination**: `/index.html`
  4. Click **Save Changes**.
- **Blueprint Automation**: Defined in [`render.yaml`](render.yaml) for infrastructure-as-code deployments.
- *Note on `_redirects`*: Unlike Netlify or Cloudflare Pages, Render Static Sites do **not** automatically process `_redirects` files. The Rewrite rule above is required for direct URL navigation and browser refreshes on routes like `/login`, `/shop`, `/cart`, and `/admin`.

