# Curio Design Guidelines — v0.2 (Markdown Export)

> *Ready for Claude Code or any markdown viewer.*

---

## 7a. Kid‑Friendly Design Language & Visual Identity Addendum
*(Insert immediately after existing **7. Design Guidelines & Visual Identity** section of the PRD.)*

### Purpose
Enhance the visual tone so that it feels magical and welcoming to children (ages 4‑8) while preserving DreamLab’s brand recognition and accessibility standards.

### Color Palette Extensions
| Token | Hex | Intended Context |
|-------|-----|------------------|
| `--color-sky-blue` | `#3ABFF8` | Daytime screens, success highlights |
| `--color-peach` | `#FFB4A2` | Warm accents, positive feedback |
| `--color-mint` | `#5EEAD4` | Discovery moments, progress bars |

*Reserve deep midnight tones for bedtime screens; shift to pastels in create‑flows to signal play.*

### Typography
* Swap display font to **Baloo 2** (rounded, friendly).  
* Keep **Atkinson Hyperlegible** (or Inter) for body copy to maximise legibility.  

### Character System
* **Curio**: full narrative guide with micro‑illustrations (wave, blink, cheer).  
* **Nova** the mini‑comet: appears in science fact tool‑tips.

### Illustration Style
* Soft‑edge, gradient look; subtle 3‑D lighting.  
* Scene ratio: **70 % cosmic backdrops**, **30 % child’s bedroom desk** (relatable context).

### Iconography
* Base size **32×32 px**, 2.5 px stroke.  
* Animated Lottie variants for core actions (camera flash, bubbling beaker, turning page).

### Copy & Micro‑UX
* Use imaginative verbs: “Launch story 🚀”, “Hatch idea 🥚”.  
* Cap reading level to Grade 4 everywhere except parent settings.

### Imagery Hooks
1. **Hero mock‑up**: Curio on a crescent moon examining the user’s last photo (dynamic overlay).  
2. **Story page sample**: Child’s photo framed as a spaceship window.  
3. **Loading state**: Nova orbits Curio, dropping sparkles that form constellation dots.

### AI‑Prompt Snippets
```text
“Cute purple owl scientist, large glossy eyes, wearing tiny glasses and lab coat, soft 3‑D lighting, deep‑space background, children’s picture‑book style, pastel color accents.”
```
```text
“Child’s bedroom at night, telescope pointing out window into vibrant galaxy, flat‑to‑3‑D hybrid illustration, dreamy gradients.”
```

---

## 7b. Curio Brand System (v0.2) – Canonical Palette & Tokens
> **Version 0.2 — July 22 2025**

### 1 · Brand Essence
Curio the Owl embodies **curiosity, wonder, and friendly guidance**. The visual language must feel magical for kids 4‑8 while earning parents’ trust through consistency, legibility, and WCAG‑AA compliance.

### 2 · Core Brand Color Palette (“Galaxy Set”)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-night-purple` | `#6B5ECF` | Primary brand surfaces, headings |
| `--color-midnight` | `#372673` | Dark backgrounds, outlines |
| `--color-sky-blue` | `#3ABFF8` | CTA buttons, daytime highlights |
| `--color-peach` | `#FFB4A2` | Positive feedback, hats/beaks |
| `--color-mint` | `#5EEAD4` | Success states, progress |
| **Gradient** | Night‑Purple → Sky‑Blue | Hero banners (“Galaxy Gradient”) |

All text/background pairings maintain ≥ 4.5 : 1 contrast.

### 3 · Explorer Sub‑Theme (for science mini‑games)
```css
--explorer-teal-500: #00A8B5;
--explorer-teal-700: #007C88;
--explorer-coral-500: #FF7043;
--explorer-coral-700: #E6572B;
--explorer-sunshine:  #FFC94D;
```

### 4 · Expanded Design Tokens
```css
/* Spacing (8‑pt grid) */
--space-4: 0.25rem;  /* 4px */
--space-8: 0.5rem;   /* 8px */
--space-12: 0.75rem; /* 12px */
--space-16: 1rem;    /* 16px */
--space-24: 1.5rem;  /* 24px */
--space-32: 2rem;    /* 32px */

/* Radius */
--radius-sm: 0.5rem;  /* 8px */
--radius-md: 1rem;    /* 16px */
--radius-lg: 2rem;    /* 32px — cards */

/* Elevation */
--elevation-1: 0 1px 3px rgba(0,0,0,.1);
--elevation-2: 0 2px 6px rgba(0,0,0,.12);
--elevation-3: 0 4px 12px rgba(0,0,0,.14);

/* Motion */
--motion-fast:   100ms cubic-bezier(0.4,0,1,1);
--motion-std:    200ms cubic-bezier(0.4,0,0.2,1);
--motion-slow:   400ms cubic-bezier(0.4,0,0.2,1);
--motion-amplitude-max: 4px; /* cap shake/bounce travel */
```

### 5 · Typography
| Role | Font | Weight | Size / LH |
|------|------|--------|-----------|
| Display / H1 | Baloo 2 | 700 | 36 / 44 px |
| H2 | Baloo 2 | 600 | 28 / 36 px |
| Body | **Atkinson Hyperlegible** | 400 | 16 / 24 px |
| Caption | Atkinson Hyperlegible | 400 | 14 / 20 px |
| Tiny / UI meta | Inter | 500 | 12 / 16 px |

> **Accessibility toggle:** Provide a UI switch to enable Atkinson across all text for Dyslexia‑friendly reading.

### 6 · Components (Spec Diagrams)
Each component Figma page includes:
1. Padding map (8‑pt grid)
2. State diagram (default → hover → active → disabled → loading)
3. Token table
4. Icon placement rule (24 px inset)

### 7 · Motion & Reduced‑Motion
* Max travel distance: 4 px  
* `prefers-reduced-motion` disables bounces & parallax  
* Reward animations: 200 ms fade‑in + 100 ms 1‑bounce (2 px)

### 8 · Accessibility Extensions
| Category | Guideline |
|----------|-----------|
| Alt‑text | ≤ 80 chars, start with verb: “Curio waving at…”. |
| Audio captions | On/off toggle; text in bottom ⅓ at 90 % width, Peach background 80 % opacity. |
| Focus ring | 2 px solid Sky‑Blue (light mode); 2 px solid Peach (dark mode). |

### 9 · Asset & Workflow
1. **Single‑source tokens** → Token Studio → `/styles/tokens.json`.  
2. **Semantic commits**: `style:`, `feat:`, `refactor:`.  
3. Freeze **v0.2** on Aug 1 2025; merge to `main` post‑QA.

---

## 7c. Explorer Sub‑Theme Spec
Use only in mini‑games and seasonal events; piggy‑backs on all other rules from 7b.

---

*End of v0.2 – July 22 2025*
