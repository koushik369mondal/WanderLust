# ChaiUI recipes

Copy-paste versions of the signature pieces, for when the `@chaiui` registry
is not available (or not installed yet). Tailwind v4 with
`references/tokens.css`. Class strings are chaicode.com's own.

## Highlight phrase

```tsx
<p className="text-base text-neutral-700 md:text-xl dark:text-neutral-400">
  Learn at your own pace with structured, <span className="highlight">high-quality video lessons</span> designed to give
  you real-world skills.
</p>
```

Without the utility: `font-montserrat font-medium tracking-tight capitalize text-yellow-800 dark:text-orange-100`.
Use one per paragraph.

## Buttons

```tsx
import { ArrowUpRight, ChevronsDown } from 'lucide-react'

// The one main action on a screen.
<a className="btn-asym inline-flex h-9 items-center gap-2 bg-neutral-900 px-4 text-sm font-medium text-white transition-colors duration-200 hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-neutral-200">
  Start learning <ArrowUpRight className="-ml-1 size-4" aria-hidden />
</a>

// Beside it.
<a className="btn-asym-mirror inline-flex h-9 items-center gap-2 border border-border bg-transparent px-4 text-sm font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-black/90">
  See the impact <ChevronsDown className="-ml-1 size-4" aria-hidden />
</a>

// On cards ("View details", "Start"): the shadcn default.
<button className="inline-flex h-8 min-w-24 items-center justify-center rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
  View details
</button>

// "View All"
<a className="inline-flex h-10 items-center gap-2 rounded-md bg-[#d4d4d866] px-6 font-montserrat text-sm text-[#52525b] dark:bg-[#71717a33] dark:text-[#d4d4d8]">
  View all <ArrowUpRight className="-ml-1 size-4" aria-hidden />
</a>
```

## Page background

```tsx
import bg from '@/assets/background.svg' // the chaicode.com SVG (2842x1132)

export function Backdrop() {
  return <img src={bg} alt="" aria-hidden className="chai-backdrop" fetchPriority="high" decoding="async" />
}
// Put it as the first child of a `relative isolate overflow-x-clip` page wrapper.
```

## Hero (one central element)

```tsx
<section className="flex gap-8 max-md:flex-col">
  <div className="my-auto flex flex-col gap-y-2.5 sm:gap-y-4 md:w-3/4">
    <AnimatedBadge>Trusted by 1.5M+ developers</AnimatedBadge>
    <h1 className="text-[42px] font-semibold tracking-tight max-md:leading-11 md:text-6xl lg:text-7xl">
      Consistency and community
    </h1>
    <p className="mt-4 max-w-3xl text-base text-neutral-700 sm:mt-6 md:text-xl dark:text-neutral-400">
      Content is everywhere. We provide what is rare, <span className="highlight">a community-driven learning experience</span>.
    </p>
    <div className="mt-6 flex items-center gap-4">{/* solid + outline buttons */}</div>
  </div>
  <div className="relative md:w-2/4 [mask-image:radial-gradient(60%_60%,#000_70%,transparent)]">{/* one image or card */}</div>
</section>
```

## Animated badge (glint around the border)

```tsx
export function AnimatedBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-flex w-fit overflow-hidden rounded-full p-px">
      <span
        aria-hidden
        className="absolute top-1/2 left-1/2 h-5 w-[300px] rounded-full bg-gradient-to-r from-transparent via-transparent to-orange-500 motion-safe:animate-[chai-spin_4s_linear_infinite]"
        style={{ transform: 'translate(-50%,-50%)' }}
      />
      <span className="relative z-10 rounded-full bg-neutral-50 px-4 py-2 text-sm font-medium text-neutral-800 dark:bg-stone-900 dark:text-neutral-100">
        {children}
      </span>
    </span>
  )
}
```

## Section head

```tsx
<h2 className="mt-16 text-2xl font-medium sm:mt-20 sm:text-[30px]">Our cohorts</h2>
<p className="text-gray-600 sm:text-lg dark:text-gray-300">
  Learn in engaging <span className="highlight">live classes</span>, with peers.
</p>
```

## Listing page (routes/udemy)

```tsx
<div className="space-y-3">
  <h1 className="text-2xl font-medium sm:text-center sm:text-3xl">Udemy courses</h1>
  <p className="mx-auto max-w-3xl text-base text-neutral-700 sm:text-center sm:text-lg md:text-xl dark:text-neutral-400">
    Learn at your own pace with <span className="highlight">high-quality video lessons</span>.
  </p>
</div>

{/* Toolbar */}
<div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
  <div className="flex items-center gap-3">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing <span className="font-semibold text-gray-900 dark:text-gray-100">10</span> courses
    </p>
    <span className="hidden h-4 w-px bg-gray-300 sm:block dark:bg-gray-700" />
    <span className="text-sm text-gray-500 dark:text-gray-400">Past and upcoming</span>
  </div>
  {/* Segmented: active = bg-orange-100 text-orange-900 dark:bg-orange-900/40 dark:text-orange-100 */}
  <div className="flex overflow-hidden rounded-md border border-gray-200 bg-white dark:border-gray-800 dark:bg-black/50">…</div>
</div>

{/* Grid of cards */}
<div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <article className="card-chai group flex flex-col overflow-hidden sm:opacity-90 sm:hover:opacity-100">
    <img className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" src="…" alt="…" />
    <div className="flex flex-1 flex-col p-3 pt-2">
      <h3 className="font-montserrat text-base leading-snug font-semibold">FastAPI with GenAI</h3>
      <p className="line-clamp-2 text-xs leading-relaxed text-gray-600 dark:text-gray-400">Build production-grade backends.</p>
      <div className="flex flex-wrap gap-1.5 pt-1">
        <span className="rounded border border-gray-200 px-2 py-0.5 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">10.5 total hours</span>
      </div>
      <div className="mt-auto flex items-end justify-between pt-3">{/* price + soft button */}</div>
    </div>
  </article>
</div>
```

## Navbar

```tsx
const [scrolled, setScrolled] = useState(false)
useEffect(() => {
  const on = () => setScrolled(window.scrollY > 0)
  on()
  addEventListener('scroll', on, { passive: true })
  return () => removeEventListener('scroll', on)
}, [])

<header className={`sticky top-0 z-50 transition-[backdrop-filter,background] duration-300 ${scrolled ? 'bg-background/60 backdrop-blur-md' : 'bg-transparent'}`}>
  <nav className="flex items-center justify-between gap-5 px-6 py-5 sm:px-12">
    {/* Logo (font-brand text-xl font-medium tracking-tight) | theme switcher + menu button, or inline dropdowns */}
  </nav>
</header>
```

The dropdown panel: `rounded-lg border border-gray-400/20 bg-background/80 p-2 backdrop-blur-lg dark:border-orange-50/10`, items `p-2 px-3 text-base hover:text-brand`.

## Footer hairline

```tsx
<footer className="relative px-6 font-montserrat sm:px-12 before:absolute before:top-0 before:left-1/2 before:h-px before:w-full before:max-w-[1440px] before:-translate-x-1/2 before:bg-amber-600 before:opacity-10 before:[mask-image:linear-gradient(90deg,transparent_0%,black_40%,black_60%,transparent_100%)] dark:before:bg-orange-300">
  …
</footer>
```

## Confirm dialog for destructive actions

Portal to `<body>`, a frosted backdrop (`bg-black/55 backdrop-blur-sm`), a `role="alertdialog"` card
(`rounded-2xl border border-card-edge-hover bg-card p-6`), and a warning icon in a red-tinted circle. Focus
starts on the safe button ("Keep it"); Escape and the backdrop cancel. List exactly what will happen, and if
other people are affected, require typing a word. Full implementation:
chaiUI `reference/chai-prep/components/ui/ConfirmDialog.tsx`.
