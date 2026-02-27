# Orbyt — Finish What You Start

A static landing page for **Orbyt**, a focus and productivity product built around the philosophy of intentional, cyclical work. The UI is designed to feel calm, atmospheric, and purposeful — matching the product's core value of quiet momentum.

---

## Project Structure

```
orbyt/
├── orbit.html              # Main HTML file
├── orbit.css               # All styles including responsive breakpoints
├── orbit.js                # Stars, parallax, and scroll reveal logic
└── images/
    ├── intention.png        # Phase 1 card image
    ├── focus.png            # Phase 2 card image
    ├── completion.png       # Phase 3 card image
    ├── release.png          # Phase 4 card image
    ├── closure.svg          # Background image for the Closure section
    ├── moon-small.png       # Small moon icon in the footer
    ├── footer-stars.png     # Starry background for the footer
    └── orbyt-logo-large.png # Full-width logo anchored at the footer bottom
```

---

## Sections

### Navigation
Fixed top bar with a blurred dark background. Contains the Orbyt SVG wordmark logo. Stays visible on scroll using `position: fixed` and `backdrop-filter: blur`.

### Hero
Full viewport height section with:
- A deep space radial gradient background
- Animated twinkling star field (generated via JS)
- A large atmospheric moon sphere (CSS radial gradient + box-shadow glow)
- Headline, subheadline, and a CTA button — `Begin The Cycle`
- **Parallax mouse tracking** on desktop: stars, moon, background, and content each move at different depths as the cursor moves

### Designed for Closure
A centered text section with:
- A `closure.svg` background image
- Two animated orbit rings with a glowing orbiting dot
- `mix-blend-mode: lighten` so the background blends with the dark page

### How the Cycle Works
A 2-column card grid showcasing the 4 phases of the Orbyt cycle:

| Phase | Label | Title |
|---|---|---|
| 1 | INTENTION | Choose One Thing |
| 2 | FOCUS | Clear the Noise |
| 3 | COMPLETION | Make It Real |
| 4 | RELEASE | Let It Go |

Each card features an image that sits tucked in the **top-right corner** at rest and **expands to fill the top of the card** on hover, using a bouncy cubic-bezier transition.

### Clarity Before Action
A centered section with a frosted-glass prompt widget introducing the reflection-first approach of Orbyt.

### Footer (CTA)
- Fixed height of `41.125rem` (658px)
- Starry background image at 60% opacity
- Small moon image icon
- Italic headline — *A new cycle begins with clarity.*
- `Start The Cycle` CTA button
- Full-width logo image absolutely positioned and pinned to the bottom edge of the footer

---

## Design Tokens

Defined as CSS custom properties in `:root`:

| Token | Value | Usage |
|---|---|---|
| `--night` | `#0e1a24` | Page background, hero, cycle section |
| `--deep` | `#0d1520` | Clarity section background |
| `--card` | `#162032` | Phase card base |
| `--neutral-10` | `#f5f7fa` | Primary text |
| `--neutral-20` | `#dadada` | Secondary / muted text |
| `--neutral-30` | `#132634` | Phase card background |
| `--muted` | `#7a8fa8` | Tertiary text |
| `--gold` | `#d4b896` | Accent for taglines |

---

## Typography

| Font | Source | Usage |
|---|---|---|
| **Domine** | Google Fonts | All headings (`h1`, `h2`, `h3`) |
| **Manrope** | Google Fonts | Body text, labels, buttons |

Both fonts are loaded via Google Fonts with `preconnect` for performance.

---

## Button Style

The `.btn` component uses a layered approach to achieve a gradient border with border-radius:

- **Background**: `rgba(255,255,255,0.1)` — 10% white fill
- **Backdrop blur**: `20px`
- **Gradient border**: Implemented via a `::before` pseudo-element using `-webkit-mask-composite: xor` to cut out the interior, leaving only a 1px gradient border ring
- **Border gradient**: `270deg`, from `rgba(255,255,255,0.1)` to `rgba(255,255,255,0.3)`
- **Hover**: Fill lifts to `0.16` opacity, border brightens to `0.2 → 0.5`

> Note: `border-image` was not used because it is incompatible with `border-radius`. The pseudo-element mask technique is the correct CSS approach.

---

## Animations & Interactions

### Twinkling Stars
120 star elements are generated in JavaScript on load. Each star has randomised:
- Size (0.5–4px, weighted toward small)
- Position (random `top`/`left` across the hero)
- Animation duration (1.5–4s)
- Animation delay (0–8s)
- Peak opacity (0.6–1.0)

The `twinkle` keyframe has 4 steps for a natural flicker feel: fade in → flare → settle → flare → fade out.

Stars also have `box-shadow: 0 0 2px 0.5px rgba(255,255,255,0.9)` for a sharp, luminous look.

### Parallax Mouse Tracking
On desktop (non-touch) devices, moving the cursor over the hero section creates a layered depth effect. Each element moves at a different rate using `lerp` smoothing in a `requestAnimationFrame` loop:

| Layer | Shift | Direction |
|---|---|---|
| Hero background | ±6px | Same as cursor |
| Stars | ±14px | Same as cursor |
| Moon | ±28px | Same as cursor |
| Hero content | ±6px | Opposite (foreground) |

Parallax is disabled on touch devices via `window.matchMedia("(hover: none)")`.

### Orbiting Dot
In the Closure section, a small glowing dot orbits a 320px ring using a CSS `rotate` animation over 18 seconds.

### Card Image Hover
Each phase card image starts at `20rem × 20rem` tucked in the top-right corner. On hover it expands to `100% × 100%` of the card image area using a `cubic-bezier(0.34, 1.56, 0.64, 1)` spring — giving a satisfying bounce overshoot.

### Scroll Reveal
All major content blocks use an `IntersectionObserver` to add a `.visible` class when they enter the viewport. Elements start at `opacity: 0; transform: translateY(30px)` and transition to fully visible. Cards have staggered `transition-delay` values (0.1s–0.4s).

---

## Responsive Breakpoints

| Breakpoint | Width | Key Changes |
|---|---|---|
| Desktop | > 1280px | Full layout, fixed card columns, parallax active |
| Large Tablet | ≤ 1280px | Cards switch from fixed `rem` to `1fr` fluid columns |
| Tablet | ≤ 1024px | Hero padding tightens, content width widens, moon shrinks to 360px |
| Mobile | ≤ 768px | Single column cards, moon fades and shrinks, all font sizes reduce, orbit rings shrink |
| Small Mobile | ≤ 480px | Moon hidden, fonts tighten further, card images reduce, parallax disabled |

---

## JavaScript Overview (`orbit.js`)

```
orbit.js
├── Star generation          — Creates 120 .star divs with randomised CSS variables
├── Parallax tracking        — mousemove lerp loop on hero (desktop only)
│   ├── isTouchDevice()      — Guards parallax behind a media query check
│   ├── lerp()               — Linear interpolation for smooth following
│   └── animateParallax()    — RAF loop applying transforms to each layer
└── Scroll reveal            — IntersectionObserver adds .visible to .reveal elements
```

---

## Browser Support

| Feature | Notes |
|---|---|
| `backdrop-filter` | Supported in all modern browsers; no visible fallback in older ones |
| `-webkit-mask-composite: xor` | Required for gradient border on `.btn`; works in Chrome, Safari, Firefox |
| `mask-composite: exclude` | Standard property alongside `-webkit-` version |
| `mix-blend-mode` | Supported in all modern browsers |
| `IntersectionObserver` | Supported in all modern browsers |
| CSS custom properties | Supported in all modern browsers |

---

## Adding New Images

| Image | Location | Notes |
|---|---|---|
| Phase card images | `./images/` | 500×500px recommended, `object-fit: cover` applied |
| Closure background | `./images/closure.svg` | SVG preferred for crispness at any size |
| Footer stars bg | `./images/footer-stars.png` | Full bleed, rendered at 60% opacity |
| Footer moon icon | `./images/moon-small.png` | Displayed at 48px, scales down on mobile |
| Footer logo | `./images/orbyt-logo-large.png` | Full width, `object-fit: cover`, pinned to footer bottom |

---

## Local Development

No build tools or dependencies required. Open `orbit.html` directly in a browser or serve with any static file server:

```bash
# Using Python
python -m http.server 3000

# Using Node
npx serve .

# Using VS Code
# Install the Live Server extension and click "Go Live"
```

---

## Fonts Preloading

The HTML includes `<link rel="preconnect">` tags for Google Fonts to reduce font load latency:

```html


```

For production, consider self-hosting the fonts for full offline support and faster load times.




