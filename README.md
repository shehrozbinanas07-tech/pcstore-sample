# PC Store — Landing Page Redesign

A premium light-themed landing page concept for [pcstore.pk](https://pcstore.pk/) — Pakistan's leading computer mega store (formerly Canon Link, Islamabad).

## Design Direction

- **Single light editorial theme** — warm paper palette (`#f3efe6`), `Fraunces` display, `Inter` body, `Space Mono` captions; ink charcoal for buttons and labels, cobalt accent for tags
- **Editorial hero** — side-by-side copy + full-bleed featured build image (no dead space beside Aurora RTX), spec chips, coordinates, and a brand marquee
- **Signature category index** — numbered list (01–06) with live image preview on hover (desktop)
- **Interactive PC configurator** — Starter / Performance / Creator tiers with animated price, live specs, and performance meters
- **Live store status** — header pill and per-showroom open/closed badges based on Islamabad hours
- **Simplified navigation** — Shop, Build a PC, Deals, Stores
- **Intentional dark accent** — WhatsApp CTA block only; footer stays light

## Signature interactions

| Feature | Behavior |
|---------|----------|
| Category index | Hover a row → preview image crossfades, row animates |
| PC configurator | Click tier → price counts up, specs flip, meters animate |
| Hero figure | Pointer sheen on desktop (fine pointer only) |
| Store status | Real-time open/closed from showroom hours (Mon–Sat) |
| Cart | Add button confirms with checkmark, header count updates |

## Performance

Built for a smooth, lag-free feel:

- Static paper grain overlay (no animated blur or orbs)
- `backdrop-filter` on header is progressively enhanced via `@supports`
- Scroll handler is `requestAnimationFrame`-throttled; class toggled only on state change
- Reveal animations use GPU-friendly `transform`/`opacity`, unobserve once shown
- Images use `loading="lazy"`, `decoding="async"`, fixed `aspect-ratio`; hero uses `fetchpriority="high"`
- Price animation has a `setTimeout` fallback so final value is always correct if rAF is throttled
- Respects `prefers-reduced-motion`

## Quick Start

Open `index.html` in any browser — no build step required.

```bash
python3 -m http.server 8765
# Visit http://localhost:8765
```

For a hard refresh after edits: `http://localhost:8765/?v=3`

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure |
| `styles.css` | Light editorial design system |
| `main.js` | Configurator, store status, category preview, cart |
| `README.md` | This file |

## Notes

Landing page concept only — product links, search, and cart are placeholders. Images use Unsplash; swap for real PC Store photography in production.
