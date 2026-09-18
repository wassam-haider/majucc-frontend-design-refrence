# MAJU CodeCraft — Design System
### "Ember & Obsidian" — Minecraft-inspired UI kit
 
This document specifies the visual language used in the MAJU CodeCraft login and
character-setup pages, so it can be reused consistently across the full MCC Portal
(public site + role-based internal system).
 
Reference implementations: `login.html`, `form.html` (attached in this project).
 
---
 
## 1. Concept
 
Instead of flat colors and gradient cards, the UI is built from **chunky pixel-block
textures** rendered in pure CSS (no image assets) — inspired by Minecraft's visual
language (blocks, ore, torches, crafting/inventory UI) but recolored entirely to
MAJU CodeCraft's brand: a dark, "obsidian" world lit by **ember orange-red** accents,
matching the logo (dark circular badge, orange→red gradient ring, `{}` code motif).
 
Core idea: **world = background chrome, panel = inventory/crafting UI, buttons/inputs
= item slots.** Everything is interactive and slightly alive (drifting smoke, flickering
torches, mouse parallax, clickable/breakable blocks) rather than static.
 
---
 
## 2. Color tokens
 
```css
:root{
  /* Background world */
  --sky-top:      #1A1A1E;   /* near-black */
  --sky-bottom:   #302426;   /* dark warm charcoal */
 
  /* "Terrain" blocks (was grass/dirt in Minecraft — now ember/obsidian) */
  --grass-top:    #E8442C;   /* ember red-orange (top face / highlight) */
  --grass-side:   #B32F1E;   /* darker red (side face / base) */
  --dirt:         #241E1D;   /* near-black block */
  --dirt-dark:    #141010;   /* darkest block shade */
  --stone:        #3A3A3E;   /* graphite grey block */
  --stone-dark:   #232326;   /* darker graphite */
 
  /* UI chrome */
  --ui-bg:        #1C1C20;   /* panel / card background */
  --ui-dark:      #0A0A0C;   /* panel border */
  --slot-bg:      #101013;   /* input / item-slot background */
 
  /* Accent (the brand gradient) */
  --gold:         #FF8A3D;   /* primary accent / buttons / focus ring */
  --ember:        #FFB238;   /* secondary accent / links / highlights */
 
  --text-dark:    #F2F2F2;   /* primary text on dark panels */
}
```
 
**Brand gradient** (used on headings, buttons, success badges):
`linear-gradient(90deg, var(--ember), var(--grass-side))` — orange → red, matching the logo ring.
 
---
 
## 3. Typography
 
| Role | Font | Usage |
|---|---|---|
| Headings / buttons / labels-as-brand | `Press Start 2P` (Google Fonts) | Pixel/blocky — used sparingly, short strings only (titles, button text, section headers) |
| Body / inputs / paragraphs | `VT323` (Google Fonts) | Reads as retro-terminal but stays legible at normal sizes — used for all form fields, descriptions, copy |
 
```html
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&display=swap" rel="stylesheet">
```
 
Keep `Press Start 2P` text short — it's wide and hard to read in long strings.
 
---
 
## 4. Core visual primitives
 
### 4.1 Pixel blocks
Built from flat color + layered `box-shadow: inset` (light/dark edges) to fake a
beveled block face, plus a `::after` pseudo-element with `radial-gradient` "noise"
dots for texture — **no image files**, pure CSS, so it stays crisp with
`image-rendering: pixelated`.
 
### 4.2 Panels (inventory/crafting-style cards)
Dark background (`--ui-bg`), thick border (`--ui-dark`, 5–6px), inset highlight/shadow
for a beveled "chest UI" look, plus a soft outer glow in the accent color:
```css
box-shadow:
  inset 4px 4px 0 rgba(255,138,61,0.15),
  inset -4px -4px 0 rgba(0,0,0,0.5),
  0 0 0 3px rgba(232,68,44,0.35),
  0 12px 0 rgba(0,0,0,0.5);
```
 
### 4.3 Item-slot inputs
Form fields styled as inventory slots: dark recessed background, inset shadow,
gold focus ring on `:focus`:
```css
.field input{
  background: var(--slot-bg);
  box-shadow: inset 3px 3px 0 rgba(0,0,0,0.5), inset -3px -3px 0 rgba(255,138,61,0.08);
}
.field input:focus{
  box-shadow: inset 3px 3px 0 rgba(0,0,0,0.5), inset -3px -3px 0 rgba(255,138,61,0.08), 0 0 0 3px var(--gold);
}
```
 
### 4.4 Buttons
Gradient fill (ember → red), pixel font, hard drop-shadow "press" animation on
`:active` (translateY + shadow swap) to mimic a chunky physical button:
```css
.mc-button{
  background: linear-gradient(90deg, var(--grass-top), var(--gold));
  box-shadow: inset 3px 3px 0 rgba(255,255,255,0.2), inset -4px -4px 0 rgba(0,0,0,0.35);
}
.mc-button:active{ transform: translateY(2px); }
```
 
---
 
## 5. Interactivity patterns (reusable across the portal)
 
- **Mouse parallax** — background layers shift subtly on `mousemove` for depth.
- **Breakable/clickable blocks** — decorative floating blocks that "crack" (repeating
  diagonal stripe overlay) on click, require 2–3 hits, then "pop" (scale+rotate+fade)
  — good for empty states, loading screens, or easter eggs.
- **Flickering torches** — small CSS `radial-gradient` flame + glow, `steps()` animation
  for a jittery (non-smooth) flicker — good ambient lighting motif for any page header/footer.
- **Hotbar step indicator** — multi-step forms use a Minecraft hotbar-style row of
  slots; active step gets a gold outline, completed steps get a ✓.
- **Skill/tag chips** — toggleable "inventory item" chips for multi-select fields
  (e.g. domains of interest, specialties) — fits the MCC application form well.
- **Success/achievement badge** — pop-in animated badge (like a Minecraft advancement
  toast) for confirmation screens.
All animations respect `prefers-reduced-motion: reduce`.
 
---
 
## 6. Mapping to the MCC Portal
 
Suggested reuse across the portal's existing spec:
 
| Portal area | Suggested treatment |
|---|---|
| Public landing / event listing | World background + floating ore blocks as decorative header, event cards as item-slot panels |
| Login / role-based auth | Direct reuse of `login.html` pattern |
| Application form (join MCC) | Direct reuse of `form.html` crafting-table pattern — steps: personal info → domain/specialty chips → confirm |
| Hierarchy tree (public/static) | Render as a "skill tree" / tech-tree style layout using the block + connector visual language |
| Ticketing / task management (internal, top-tier only) | Hotbar-style status indicators (open/in-progress/done as slot states) |
| Executive Community / alumni page | Achievement-badge style cards per alumnus, using the success-badge primitive |
 
---
 
## 7. Assets & constraints
 
- **No external images** — all textures are CSS-drawn for crisp pixel rendering
  at any resolution and zero asset loading.
- **Fonts**: Google Fonts only (`Press Start 2P`, `VT323`) — safe for published
  artifact pages (allowed font host).
- **Self-contained HTML** — each page inlines its own CSS/JS; safe to publish as
  a Claude artifact or host as a static file.
- Favicon convention: 🔥 emoji.
---
 
## 8. Source files
 
- `login.html` — sign-in page (world background, parallax, breakable ore blocks, torches)
- `form.html` — multi-step crafting-table form (hotbar steps, skill chips, success badge)
Both are fully commented and use CSS custom properties (`:root` tokens above) as the
single source of truth for color — re-theming only requires editing the `:root` block.
 
