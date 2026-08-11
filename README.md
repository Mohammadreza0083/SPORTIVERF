# SPORTIVERF — Light Luxury Sports Tourism Platform

> **Premier International Sports Tourism, Elite Showcases & Athletic Retreats**  
> Operated under the official license and supervision of **Aklimosaturizm**.

---

## 🏆 Overview

**SPORTIVERF** is a luxury sports tourism and overseas athletic showcase platform designed to connect young athletic talent, agents, and clubs to international European academies and trials. Built with a **Light Luxury** design aesthetic (Apple/Airbnb service vibe), the platform features warm off-white surfaces, deep charcoal typography, subtle gold accents, and 100% site-wide internationalization across **English**, **Turkish**, and **Persian (RTL)**.

---

## 🎨 Key Features & Highlights

### 1. Light Luxury Design Identity

- **Palette**: Surface White/Cream (`#FAF9F6`), Deep Charcoal (`#0D0D0D`), Luxury Gold (`#C5A059`), and Subtle Borders (`#E5E3DC`).
- **Typography**: Display Serif (`Cormorant Garamond` & `Playfair Display`), Sans-serif Body (`Inter`), Data/Specs (`Space Mono`), and Persian Google Font (`Vazirmatn`).
- **Mobile Responsive**: Enforced zero horizontal scroll overflow with responsive padding across all mobile viewports.

### 2. Full Internationalization (i18n) & Language Gate

- **Supported Languages**: English (`en`), Turkish (`tr`), Persian (`fa` - RTL).
- **Language Gate Modal**: First-time visitor modal in [`LanguageGate.astro`](src/components/LanguageGate.astro) saving choice to `localStorage` and `cookie`, with 404-free routing redirect logic.
- **Header Language Switcher**: Persistent in [`Header.astro`](src/components/shared/Header.astro).

### 3. Tiered Camp Hierarchy & Dual Filtering

- **Sports**: Football Showcase Camps & Volleyball Masterclasses.
- **Star Tiers**:
  - ⭐⭐⭐ **3-Star Essentials Clinic**: Foundational skills and pitch drills.
  - ⭐⭐⭐⭐ **4-Star Executive Academy**: High-performance physical conditioning & video breakdown.
  - ⭐⭐⭐⭐⭐ **5-Star VIP Luxury Showcase**: 5-star beachfront resorts, UEFA/FIVB coaches, and direct scout exposure.
- **Dual Filter Bar**: Filter by sport and star-tier in [`FilterBar.astro`](src/components/islands/FilterBar.astro).

### 4. "Price on Request" Concierge Model

- **No Static Pricing**: Numerical public pricing replaced with luxury gold badges (**"Price on Request"**).
- **Direct Concierge Action**: Active CTA buttons (**`[ INQUIRE FOR PRICING ]`**) that transmit inquiries directly to the concierge team.

### 5. Telegram Bot API & Interactive Webhook

- **Direct Telegram Integration**: Transmits inquiry payloads to Telegram Bot (`8921060827:...`) in real-time.
- **Interactive Inline Keyboard Button**: Formats WhatsApp contact actions as native Telegram buttons (`💬 Open WhatsApp Chat`).
- **Python Listener Service**: Standalone Python webhook server in [`scripts/telegram_listener.py`](scripts/telegram_listener.py).

### 6. Production Error Pages

- Custom Light Luxury error pages with Vazirmatn/Inter typography and localized CTAs:
  - `404.astro` / `[locale]/404.astro` (_Out of Bounds_)
  - `403.astro` / `[locale]/403.astro` (_Access Forbidden_)
  - `500.astro` / `[locale]/500.astro` (_Internal Server Timeout_)
  - `400.astro` / `[locale]/400.astro` (_Bad Request Format_)

---

## 🛠 Tech Stack

- **Core Framework**: [Astro 4.x](https://astro.build/) (Static Site Generation with Server Endpoints)
- **Styling**: Vanilla CSS custom properties & [Tailwind CSS](https://tailwindcss.com/)
- **Type Checking**: TypeScript (`strict` mode)
- **Icons & Media**: Inline SVG icons & [Unsplash API](https://unsplash.com/) images
- **Backend Communication**: Telegram Bot API, Fetch API, and Python `http.server`

---

## 📁 Project Structure

```text
SportivERF/
├── public/                     # Static assets (favicons, media)
├── scripts/
│   └── telegram_listener.py    # Python Telegram webhook listener service
├── src/
│   ├── components/
│   │   ├── islands/            # Interactive Astro Islands
│   │   │   ├── BookingIsland.astro
│   │   │   └── FilterBar.astro
│   │   ├── seo/                # SEO & Optimized Image components
│   │   │   ├── OptimizedImage.astro
│   │   │   └── SEO.astro
│   │   ├── shared/             # Shared Layout UI components
│   │   │   ├── CampCard.astro
│   │   │   ├── ContactButtons.astro
│   │   │   ├── Footer.astro
│   │   │   ├── Header.astro
│   │   │   └── LanguageSwitcher.astro
│   │   └── LanguageGate.astro  # First-time visitor language modal
│   ├── data/
│   │   └── camps.ts            # Centralized dataset for Tiered Camps
│   ├── i18n/
│   │   ├── config.ts           # i18n locale definitions & RTL settings
│   │   ├── utils.ts            # Translation helper functions
│   │   └── translations/       # Dictionaries (en.ts, tr.ts, fa.ts)
│   ├── layouts/
│   │   ├── BaseLayout.astro    # Base HTML document & Google Fonts
│   │   └── MainLayout.astro    # Header, Footer, and main layout container
│   ├── pages/
│   │   ├── api/
│   │   │   └── inquiry.ts      # Server API endpoint for Telegram dispatch
│   │   ├── [locale]/           # Localized dynamic page routes
│   │   │   ├── about.astro
│   │   │   ├── football-camps/
│   │   │   ├── volleyball-camps/
│   │   │   ├── tours/
│   │   │   ├── camps/[slug].astro
│   │   │   ├── 404.astro
│   │   │   ├── 403.astro
│   │   │   ├── 500.astro
│   │   │   └── 400.astro
│   │   ├── 404.astro           # Fallback error pages
│   │   ├── 403.astro
│   │   ├── 500.astro
│   │   ├── 400.astro
│   │   ├── index.astro         # Root redirect
│   │   ├── robots.txt.ts
│   │   └── sitemap.xml.ts
│   ├── styles/
│   │   └── global.css          # Design system CSS custom tokens & resets
│   └── types/
│       └── i18n.ts
├── astro.config.mjs            # Astro configuration
├── tailwind.config.mjs         # Tailwind configuration & typography tokens
├── tsconfig.json               # TypeScript configuration
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **Python**: 3.8+ (optional, for standalone `telegram_listener.py` webhook service)

### 2. Installation

Clone the repository and install node dependencies:

```bash
git clone https://github.com/your-repo/SportivERF.git
cd SportivERF
npm install
```

### 3. Development Server

Start the local development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:4321`.

### 4. Type Check & Validation

Run type check and diagnostic verification across all 62+ project files:

```bash
npm run check
```

### 5. Production Static Build

Generate the production-ready static bundle (generates 67 static HTML pages across all locales):

```bash
npx astro build
```

Output files will be located in the `dist/` directory.

### 6. (Optional) Run Python Telegram Webhook Listener

If running the standalone Python receiver server on port 5000:

```bash
python scripts/telegram_listener.py
```

---

## ⚖️ Legal & License

© 2026 **SPORTIVERF**. All Rights Reserved.  
SPORTIVERF operates under the direct legal supervision and authorized license of **Aklimosaturizm**.
