# SportivERF — Enterprise Software Architecture Blueprint

> **Principal Software Architecture Specification**  
> **Platform**: SportivERF (Sports Tourism Multilingual Web Platform)  
> **Core Engine**: Astro 4.x (Static Site Generation / Micro-frontend Islands Architecture)  
> **Primary Language**: TypeScript (Strict Mode)  
> **Target Audience**: Enterprise Frontend Engineers, Backend Architects, DevOps Engineers  
> **License**: Private & Proprietary — SportivERF 2026  

---

## Executive Summary & System Vision

SportivERF is engineered as a high-performance, statically generated, multilingual sports tourism web platform. The platform is designed from first principles according to **Clean Architecture** and **SOLID** principles. 

Key architectural invariants:
1. **Zero JavaScript by Default**: Render 100% pure HTML/CSS at build time via Astro SSG.
2. **Astro Islands Client Strategy**: Hydrate interactive widgets (booking widget, filter drawers) as isolated client islands using explicit directive strategies (`client:visible`, `client:idle`, `client:media`).
3. **Decoupled Data Layer**: All page components consume abstract contracts (`ITourRepository`, `ICmsProvider`, `IBookingService`). Switching from static pre-render to live **ASP.NET Core REST API** or **Headless CMS** requires zero modifications to presentation views.
4. **First-Class i18n & RTL**: Deeply integrated dynamic routing (`/en`, `/fa`, `/ar`) with type-safe dictionaries and automated text direction context (`ltr` / `rtl`).

---

## System Architecture Diagram

```
+-------------------------------------------------------------------------------+
|                               Presentation Layer                              |
|   +---------------------+   +---------------------+   +-------------------+   |
|   |  BaseLayout.astro   |   |  MainLayout.astro   |   |   SEO.astro       |   |
|   +----------+----------+   +----------+----------+   +---------+---------+   |
|              |                         |                        |             |
|              v                         v                        v             |
|   +-----------------------------------------------------------------------+   |
|   |                  Localized Astro Static Pages                         |   |
|   |               (src/pages/[locale]/tours/[slug].astro)                |   |
|   +------------------------------------+----------------------------------+   |
+----------------------------------------|--------------------------------------+
                                         |
                                         v
+-------------------------------------------------------------------------------+
|                       State & Hydration (Nanostores)                          |
|   +--------------------+  (client:visible)   +----------------------------+   |
|   | bookingDraftStore  | <=================> | BookingIsland (Client UI)  |   |
|   +--------------------+                     +----------------------------+   |
+----------------------------------------|--------------------------------------+
                                         |
                                         v
+-------------------------------------------------------------------------------+
|                           Service Abstraction Layer                           |
|   +-------------------------+   +-------------------+   +-----------------+   |
|   |    ITourRepository      |   |   ICmsProvider    |   | IBookingService |   |
|   +------------+------------+   +---------+---------+   +--------+--------+   |
|                |                          |                      |            |
|       +--------+--------+                 |                      |            |
|       |                 |                 |                      |            |
|       v                 v                 v                      v            |
| +-----------+   +---------------+   +------------+     +-------------------+  |
| | Mock/SSG  |   | ASP.NET Core  |   | Strapi /   |     | Booking Micro-    |  |
| | Adapter   |   | REST API      |   | Headless   |     | service Gateway   |  |
| +-----------+   +---------------+   +------------+     +-------------------+  |
+-------------------------------------------------------------------------------+
```

---

## Directory & Folder Structure

The project follows a modular, layer-segmented folder hierarchy:

```
SportivERF/
├── .env.example              # Environment variables template
├── .gitignore                # Enterprise git ignore rules
├── .prettierrc               # Code formatting rules
├── ARCHITECTURE.md           # Master architecture documentation
├── LICENSE                   # Private & Proprietary license (2026)
├── astro.config.mjs          # Astro engine & i18n build configuration
├── eslint.config.js          # Flat ESLint rules for TypeScript & Astro
├── package.json              # Package manifest and script tasks
├── tsconfig.json             # Strict TypeScript configuration
└── src/
    ├── env.d.ts              # Environment & Astro ambient type declarations
    ├── assets/               # Local static images, fonts, icons
    ├── components/
    │   ├── shared/           # Primitive framework-agnostic Astro components (SEO, Lang)
    │   └── islands/          # Interactive client widgets (Hydrated via Astro directives)
    ├── i18n/
    │   ├── config.ts         # Locale metadata, default locale, RTL definitions
    │   ├── utils.ts          # Type-safe t() translation function and URL helpers
    │   └── translations/     # Locale dictionaries (en.ts, fa.ts, ar.ts)
    ├── layouts/
    │   ├── BaseLayout.astro  # HTML5 document skeleton (lang, dir, meta tags)
    │   └── MainLayout.astro  # App structure (Header, Navigation, Footer, Slot)
    ├── pages/
    │   └── [locale]/         # Dynamic route parameter capturing /en, /fa, /ar
    │       ├── index.astro
    │       └── tours/
    │           ├── index.astro
    │           └── [slug].astro
    ├── services/             # Clean Architecture Data Services
    │   ├── api/              # ApiClient, ITourRepository, ApiTourRepository
    │   ├── cms/              # ICmsProvider, StaticCmsAdapter, StrapiCmsAdapter
    │   └── booking/          # IBookingService, BookingService
    ├── store/                # Reactive state management for Astro Islands
    │   └── bookingStore.ts   # Nanostores reactive state
    ├── types/                # Strict TypeScript Contract Models
    │   ├── api.ts            # ASP.NET Core REST API DTO models
    │   ├── booking.ts        # Booking engine models
    │   ├── cms.ts            # Domain entity schemas
    │   └── i18n.ts           # Locale & dictionary schemas
    └── utils/                # Pure utility functions
        ├── env.ts            # Zod environment variable parser
        ├── formatters.ts     # Currency, date, and digit formatters
        └── image.ts          # Image optimization & CDN URL resolver
```

---

## Route Architecture & Internationalization (i18n)

### Routing Strategy
- **Explicit Locale Prefixing**: Routes are strictly prefixed with ISO language codes (`/en/tours`, `/fa/tours`, `/ar/tours`).
- **Dynamic Route Files**: Utilizes Astro's file-based route parameter matching: `src/pages/[locale]/tours/[slug].astro`.
- **Static Generation (`getStaticPaths`)**: During static site generation (SSG), Astro resolves all supported locales (`en`, `fa`, `ar`) and tour slugs at build time.

### Direction Handling (LTR / RTL)
- Locales `fa` (Persian) and `ar` (Arabic) set `dir="rtl"` on `<html>` and load specialized Vazirmatn typography.
- Locale `en` (English) sets `dir="ltr"` and loads Plus Jakarta Sans font.
- CSS classes leverage logical spacing utilities (`space-x-reverse`, `ms-auto`, `pe-4`) to ensure natural bidirectional layout flow.

---

## Astro Islands & Hydration Strategy

To maximize performance, client-side JavaScript is deferred or omitted entirely:

| Directive | Use Case in SportivERF | Reason |
| :--- | :--- | :--- |
| **No Directive** (Default) | Cards, Header, Footer, Static Tour Details | Zero JS bundle footprint. Output as static HTML. |
| `client:visible` | Interactive Booking Form, Tour Date Picker | Hydrates JS code only when component scrolls into viewport. |
| `client:idle` | Language Switcher Drawer, Currency Picker | Low priority hydration after main page rendering finishes. |
| `client:media="(max-width: 768px)"` | Mobile Navigation Drawer | Hydrates JS only on mobile screen viewports. |

---

## State Management Strategy (Nanostores)

Because Astro pages consist of decoupled static HTML and micro-frontend client islands:
- Standard React Context or Redux cannot share state across distinct island roots.
- **Nanostores** is selected as the lightweight (1KB), framework-agnostic atomic store.
- `bookingDraftStore` maintains reactive client state (selected tour, date, participants) across islands without re-rendering the surrounding static HTML.

---

## Future Backend & CMS Integration Strategy

### ASP.NET Core Web API Alignment
All TypeScript interfaces in `src/types/api.ts` directly mirror ASP.NET Core C# DTOs:

| TypeScript Model (`src/types/api.ts`) | ASP.NET Core C# Equivalent DTO |
| :--- | :--- |
| `ApiResponse<T>` | `ApiResponse<T>` (Standard Wrapper) |
| `PaginatedResult<T>` | `PagedList<T>` / `PaginatedResponse<T>` |
| `CreateBookingRequest` | `CreateBookingCommand` / `BookingRequestDto` |

### Repository Pattern (`ITourRepository`)
Page components depend strictly on interface `ITourRepository`.
- **Static Phase**: `MockTourRepository` supplies JSON mock data for SSG pre-rendering.
- **Production API Phase**: `ApiTourRepository` communicates with ASP.NET Core endpoint using `ApiClient`.
- **Switch Control**: Controlled via single environment variable: `PUBLIC_CMS_PROVIDER=api`.

---

## Coding Standards & SOLID Principles Enforced

1. **Single Responsibility Principle (SRP)**: Components perform presentation only; data fetching and formatting are delegated to services and formatters.
2. **Open/Closed Principle (OCP)**: Services extend behavior through Strategy adapters (`ICmsProvider`, `ITourRepository`) without altering core logic.
3. **Liskov Substitution Principle (LSP)**: `ApiTourRepository` and `MockTourRepository` are completely interchangeable.
4. **Interface Segregation Principle (ISP)**: Type contracts are split into modular domain files (`api.ts`, `cms.ts`, `booking.ts`).
5. **Dependency Inversion Principle (DIP)**: Modules depend on abstractions, never concrete implementations.

---

## Scalability & Enterprise Maintainability

- **Strict Type Checking**: TypeScript `strict: true` and `noImplicitAny: true` prevent runtime type errors.
- **Zod Schema Validation**: Validates environment variables and API payloads at runtime boundary.
- **Code Consistency**: Managed via flat ESLint rules and Prettier Astro formatting.
