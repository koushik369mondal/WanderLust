---
name: chaiui-review
description: Review UI code or a running page against the ChaiUI rules (the chaicode.com look) and report what breaks them, with file and line. Use when the user asks to review, audit, check or polish UI built with ChaiUI or @chaiui components, asks "does this follow the chaicode style", or before shipping a page in a ChaiCode product. Pairs with the chaiui skill, which is for building.
---

# ChaiUI review

Check work against the ChaiUI rules and report what breaks them. Do not
restyle anything while reviewing; list the findings, then fix them only if
the user asks.

The rules come from the ChaiUI design system (https://ui.chaicode.com). If
the `chaiui` skill is installed, its rules are the full version of this list.

## 1. Search the code

Run these over the files that changed (adjust the path). Each hit is a
finding unless the exception applies.

```bash
# Em dashes, anywhere: code, comments, copy. Always a finding.
grep -rn "$(printf '\342\200\224')" src/

# Orange as a fill. Allowed only on a segmented control's active segment
# (bg-orange-100 / bg-orange-900/40) and the footer's 1px before: hairline.
grep -rnE "bg-orange-|bg-\[#(FF7D0C|ff7d0c|FE9332|fe9332)\]" src/

# Drop shadows. ChaiUI has none: depth is the warm hairline and the fill.
grep -rnE "shadow-(sm|md|lg|xl|2xl)|drop-shadow" src/

# Gradient text. Only the ShinyText component may do this.
grep -rnE "bg-clip-text|text-transparent" src/

# All-caps eyebrows and labels. Caps are only for data labels (table heads,
# footer column heads, status chips).
grep -rnE "uppercase|tracking-widest" src/
```

## 2. Read for the rules a search cannot catch

- **One highlight per paragraph.** The cream Montserrat phrase
  (`<Highlight>` or `className="highlight"`) appears at most once in any
  paragraph. Two in one paragraph is a finding.
- **One solid button per screen.** The white asymmetric button
  (`variant="solid"`) is the single main action. A second one is a finding.
  Buttons on cards are the soft default, never solid.
- **One central element in a hero.** No floating, tilted cards or badges
  around the hero media.
- **Status is text and outline.** No filled status pills, no coloured card
  borders. Green, red, yellow and one purple, as text or thin strokes.
- **Sentence case** in headings, buttons and labels ("View details", not
  "View Details"). The highlight phrase is the one place words are
  capitalised, and the CSS does that.
- **Copy is plain.** Professional and friendly, no hype, no em dashes.
- **Dark first.** The page works in dark by default and in light.
- **Accessible.** Icon-only buttons have an aria-label; form fields have
  labels; every motion respects `prefers-reduced-motion`; everything works
  from the keyboard.
- **Prefer the registry.** A hand-rolled navbar, hero, card, dialog or
  table that duplicates a `@chaiui/*` item is a finding: suggest
  `npx shadcn@latest add @chaiui/<name>`.

## 3. Look at it, if it runs

- Dark and light: in light mode the background stays warm (not blue), and
  nothing is unreadable.
- Phone width (375px): no sideways scroll, nothing clipped.
- The header is transparent at the top and blurs only after scrolling.

## 4. Report

One list, most serious first. For each finding give the file and line,
the rule it breaks, and the fix in one line:

```
1. src/pages/pricing.tsx:42  Orange fill on the "Buy" button (bg-orange-500).
   Rule: orange is never a fill. Fix: variant="solid" (white on dark).
2. src/components/hero.tsx:18  Two highlighted phrases in the lead.
   Rule: one highlight per paragraph. Fix: keep "community-driven learning".
```

End with what passed, in one line, so the user knows what was checked.
If nothing breaks a rule, say so plainly.
