---
name: chaiui
description: The ChaiUI design system, the chaicode.com look (near-black warm background with a hexagon glow, white Manrope headlines, one pale-cream Montserrat highlight phrase per paragraph, solid white buttons with asymmetric corners, warm hairline cards with no shadow, almost no orange). Use when building or restyling UI for ChaiCode products (chaicode.com, Chai Prep / dsa.chaicode.com, any Hitesh Choudhary / ChaiCode project), when the user mentions ChaiUI, @chaiui, the "chaicode look/style", or asks for UI "like chaicode", and when adding @chaiui components with the shadcn CLI.
---

# ChaiUI

The chaicode.com look as an opinionated system. Premium comes from restraint:
neutral near-black, white type, one quiet cream accent, warm hairlines, and
orange almost nowhere.

The live docs at https://ui.chaicode.com show every component in dark and
light with its code, and https://ui.chaicode.com/llms.txt lists them all.
When a detail is not covered here, read those, never guess from a screenshot.

## First, decide how to apply it

1. **Is `@chaiui` published?** Yes, at ui.chaicode.com. Check
   `references/components.md` and **prefer an existing item over hand-rolling
   one**: the navbar, hero, cards, section heads and footer already exist as
   components. Check it. For each item
   marked `shipped`, install it:
   `npx shadcn@latest add @chaiui/<name>` (with
   `"registries": { "@chaiui": "https://ui.chaicode.com/r/{name}.json" }` in
   `components.json`). Always install `@chaiui/chaiui` (the theme) first.
2. **Not shipped yet, Tailwind v4 project:** put `references/tokens.css` in the
   app's main CSS. Build each piece from `references/recipes.md`.
3. **Tailwind 3 project:** follow `references/tailwind3.md`.

## The rules (non-negotiable)

**Colour**
- Dark is the default. Background `oklch(0.145 0 0)` (#0a0a0a), text near-white,
  pure neutral greys (chroma 0).
- Accent is **highlight cream**: `orange-100` in dark, `yellow-800` in light. Only
  for highlighted phrases and the odd active state.
- **Orange is never a fill.** It is allowed only in:
  - the logo;
  - `hover:text-brand` on links;
  - the 1px glint on the animated badge;
  - a 10% footer hairline;
  - a segmented control's dark-brown active fill (`orange-900/40`).

  No orange buttons, headings, ticks, progress bars or badges.
- Meaning uses colour as text or a thin outline: green for done or discount,
  red for wrong or old price, yellow for medium, purple for one special
  category. Never as filled status pills or coloured card borders.

**Type**
- Manrope for everything. Montserrat for card titles, prices, buttons on cards
  and the highlight phrase. Onest for the wordmark.
- Hero h1: `text-[42px] md:text-6xl lg:text-7xl font-semibold tracking-tight`.
- Page title: `text-2xl sm:text-3xl font-medium`, centred.
- Section h2: `text-2xl sm:text-[30px] font-medium`.
- Lead: `text-base md:text-xl text-neutral-400` (dark).
- **The highlight phrase:** one per paragraph,
  `font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100`.

**Surfaces**
- The chaicode background SVG, centred at the top, with these conditions:
  - in light mode, use `invert(1) hue-rotate(180deg)`, not a plain invert, which turns blue;
  - mask its bottom to fade out.
- Cards:
  - `rounded-xl border-orange-50/15 bg-black/10 backdrop-blur-sm` in dark;
  - `border-amber-900/15 bg-white/70` in light;
  - **no shadow**;
  - `sm:opacity-90 hover:opacity-100`, hover border `/30`.
- One page width, `max-w-6xl` with `p-6 sm:p-12`.

**Buttons**
- **Solid** (one per screen): `rounded-none rounded-tr-lg rounded-bl-lg`, white
  on dark, `ArrowUpRight` icon.
- **Outline** beside it: the mirrored corners.
- **On cards:** shadcn default (`bg-primary`, light grey on dark), `font-semibold`.
- **Danger:** red fill, only in a confirm dialog.

**Navigation**
- The header is sticky, transparent, and blurs only after scrolling.
- Two layouts:
  - chaicode: logo, then a theme switcher and a menu button;
  - inline dropdowns, for products with many sections (Chai Prep uses this one).
- The theme switcher is a half-circle with one label for both themes, to avoid
  SSR mismatches.

**Motion:**
- framer-motion / `motion`, with subtle 200 to 300ms hovers;
- images `scale(1.03)`;
- reveal on scroll once;
- always respect `prefers-reduced-motion`.

**Copy (Hitesh's rules):**
- no em dashes anywhere (use a comma, colon, full stop or brackets);
- sentence case;
- no all-caps eyebrows (caps only for data labels);
- professional and friendly;
- **one central element in a hero**, no floating tilted cards or badges around it.

**Destructive actions:**
- a confirm dialog that says exactly what will happen;
- focus on the safe choice first;
- type-to-confirm when other people are affected.

## Before you finish

- Check both themes, and phone width (no sideways scroll).
- Search what you wrote for em dashes and for `bg-orange` / `#FF7D0C` fills.
- Show the user a screenshot. Hitesh reviews visually.
- To check finished work against these rules, use the `chaiui-review` skill.
