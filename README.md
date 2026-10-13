# NEXUS NEWS — Modern 3D Editorial News Platform

A modern, visually refined, and fully responsive news platform built with subtle 3D effects, smooth physics-driven animations, and a clean editorial interface.

![NEXUS NEWS Preview](https://images.unsplash.com/photo-1505142468610-359e7d316be0?auto=format&fit=crop&w=1200&q=80)

---

## Highlights

- **Visual Tone:** Deep navy & charcoal dark theme, electric blue (`#3b82f6`) and purple (`#8b5cf6`) accents, glassmorphic navigation and cards, glowing radial borders.
- **Subtle 3D Physics:**
  - **Hero Scene:** Floating polyhedral crystal nodes and interactive particle stars with pointer parallax, throttled to 0 FPS when out of view.
  - **Global 3D Radar Globe:** Holographic wireframe Earth with spherical coordinates (`lat`/`lng`), pulsing beacon markers, and shortest-path ease rotation to selected dispatch locations.
  - **3D Tilt Cards:** Pointer-driven perspective tilt with spring dampening and cursor-following glow highlight.
- **Complete Editorial Experience:**
  - **Home Page:** Featured breaking story, live wire marquee ticker, curated trending stories, interactive 3D globe radar, chronological stream with category filter tabs and "Load More" pagination.
  - **Article Detail Page:** Scroll reading progress bar, drop caps, pull quotes, bylines, tag navigation, social sharing (X, LinkedIn, Copy Link), and related dispatches.
  - **Category Archives:** Dedicated pages for World, Technology, Business, Science, and Entertainment with subtopic tag filtering.
  - **Quick Search (`⌘K` / `Ctrl+K`):** Real-time debounced modal dialog with keyboard navigation (`↑`, `↓`, `Enter`, `Esc`) and full search archive page (`/search?q=...`).
  - **Reading List / Bookmarks:** Slide-over drawer with unread counter badge and persistent `localStorage` storage.
  - **Dark / Light Mode:** Smooth theme transition with system and manual preference toggle.
  - **Confetti Celebrations:** Celebratory particle bursts on newsletter subscription.

---

## Tech Stack

| Technology | Purpose |
| --- | --- |
| **React 19** | Component framework |
| **TypeScript** | Strict typing across data, APIs, and components |
| **Vite 8** | Ultra-fast development and build pipeline (~218ms builds) |
| **Tailwind CSS v4** | Tokenized styling, dark mode, typography, glassmorphism |
| **Framer Motion** | Page transitions, spring physics, layout animations |
| **Three.js & React Three Fiber** | Lightweight, GPU-efficient 3D scenes and holographic globe |
| **Lucide React** | Clean, minimalist editorial iconography |
| **Canvas Confetti** | Interactive subscription microinteraction |

---

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/InviXtaHydra/nexus-news.git
cd nexus-news

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
nexus-news/
├── src/
│   ├── components/
│   │   ├── 3d/           # Three.js / R3F canvases (HeroScene, NewsGlobe)
│   │   ├── home/         # HeroSection, Ticker, TrendingSection, GlobeSection, LatestSection, NewsletterCard
│   │   ├── layout/       # Navbar, Footer, Layout, SearchDialog, BookmarkDrawer, ThemeToggle
│   │   ├── news/         # TiltCard, ArticleCard, ArticleListItem, ArticleMeta, SectionHeading
│   │   └── ui/           # SmartImage, Skeletons, CategoryBadge, BrandIcons, Reveal
│   ├── context/          # ThemeContext, BookmarkContext
│   ├── data/             # articles.ts (15 editorial articles), categories.ts
│   ├── hooks/            # useAsync, useInView, useMediaQuery
│   ├── lib/              # format.ts (dates, read time, image sizing)
│   ├── pages/            # HomePage, ArticlePage, CategoryPage, SearchPage, NotFoundPage
│   ├── services/         # newsService.ts (API abstraction layer)
│   ├── types/            # news.ts
│   ├── App.tsx           # Router configuration & providers
│   ├── index.css         # Tailwind v4, custom theme tokens, typography, glass effects
│   └── main.tsx          # Application entrypoint
├── package.json
├── tsconfig.json
└── vite.config.ts        # Manual chunk splitting configuration
```

---

## License

MIT © [InviXtaHydra](https://github.com/InviXtaHydra)
