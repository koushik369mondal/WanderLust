# ChaiUI on Tailwind 3

ChaiUI targets Tailwind v4. For a Tailwind 3 project (Chai Prep, dsa.chaicode.com,
is one), keep the CSS variables from `tokens.css` (`:root` and `.dark` blocks,
plain CSS, no `@theme`), and map them in `tailwind.config`:

```ts
export default {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
        brand: ['Onest', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: { DEFAULT: 'var(--primary)', foreground: 'var(--primary-foreground)' },
        muted: { DEFAULT: 'var(--muted)', foreground: 'var(--muted-foreground)' },
        border: 'var(--border)',
        brand: 'var(--brand)',
        highlight: 'var(--highlight)',
        'card-edge': 'var(--card-edge)',
      },
      borderRadius: { lg: 'var(--radius)', md: 'calc(var(--radius) - 2px)', sm: 'calc(var(--radius) - 4px)' },
    },
  },
}
```

Turn the `@utility` blocks from `tokens.css` into plain classes in `@layer components`.

**Chai Prep is a special case.** It themes by `data-theme="dark"` on `<html>`,
not a `.dark` class, and keeps its own token names (`--paper`, `--ink`,
`--accent` as an "R G B" triple). Its port of the look is in classes named
`cc-*` and `ui-*`. In that repo, use its classes rather than these; see its
`app/globals.css`.
