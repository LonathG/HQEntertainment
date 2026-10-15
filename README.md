# HQ Entertainment - Website Snapshot

This directory contains the production web root snapshot (`public_html`) for **HQ Entertainment** (`hqentertainmentsl.com`), originally exported from a Next.js App Router project and hosted on Hostinger / cPanel.

---

## 🚀 Running the Website Locally

A zero-dependency local development server has been configured. You can start the website immediately without running `npm install`:

```bash
npm run dev
```

or:

```bash
npm start
```

or directly with Node.js:

```bash
node server.js
```

Once started, open your browser at:
**[http://localhost:3000](http://localhost:3000)**

---

## 📁 Directory Structure & Key Pages

- **`index.html`** — Homepage featuring:
  - Dynamic Hero section with fluid red canvas animations and GSAP laser effects.
  - **Selected Works** grid (Forecoms, Tribute to Legend, Sadde Music Video, Helakuru, Spa Ceylon).
  - High-resolution dynamic parallax image gallery.
  - **Services** overview cards (Pro Sound, Event Lighting, Stage Design, LED Walls, Full Event Production, Video Production).
  - **About HQ** team profiles (Director, Coordinators, Sound Engineers, 3D Visualizer, IT Developer).
  - **Get In Touch / Connect** section with quote phone triggers and social links.
  - Responsive mobile navigation bar and smooth scroll anchor links (`#work`, `#services`, `#about`, `#connect`).
- **`services/`** — Detailed service showcase pages:
  - `pro-sound.html` (Professional PA sound systems & consoles)
  - `event-lighting.html` (Moving heads, beam fixtures, stage lighting)
  - `stage-design.html` (Custom trussing, structural stage design)
  - `led-walls.html` (P2/P3 high-resolution modular LED displays)
  - `full-event-production.html` (End-to-end concert and corporate event production)
  - `video-production.html` (Multi-cam recording, live streaming, editing)
- **`works/` & `selectedWork/`** — Case study pages with media galleries for each client event.
- **`_next/`** — Static Next.js compiled chunks, CSS bundles, optimized webp media, and font files.
- **`Fonts/`** — Custom typography assets (`Avengenz 400`, `Avenir LT Pro`, `Old Standard TT`).
- **`server.js`** — Built-in HTTP server handling clean URLs (e.g. `/services/pro-sound` maps to `services/pro-sound.html`), MIME types, and URI-encoded assets.
- **`.htaccess` / `htaccess`** — Apache / LiteSpeed rewrite rules for deploying back to Hostinger or cPanel.

---

## 🌐 Deploying to a New Hosting Plan

If you renew or migrate to a new hosting provider (Hostinger, cPanel, Namecheap, etc.):
1. Connect via FTP or the hosting File Manager.
2. Upload all files from this directory directly into your domain's `public_html` root folder.
3. Ensure `.htaccess` is uploaded (ensure dotfiles are visible in your FTP client).
