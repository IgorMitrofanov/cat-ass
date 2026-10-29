# Кошачье очко

## Direction

A Russian joke grooming salon, designed as a warm, irreverent pet-care poster. Persuade mode with an interactive character fitting room. The user delegates art direction.

The subject offers five useful materials: removed fur, nail clippings, grooming scissors, a lion haircut, and the cat's offended expression. Three considered concepts: an absurd luxury salon, a grooming receipt, and a character fitting room. The fitting room wins because the user explicitly asks for the same mascot in different procedures. Borrow the confident scale of an independent magazine and the plain service list of a neighborhood barbershop.

Five-line plan:
1. Expressive character portraits and oversized, heavy Cyrillic typography.
2. Tangerine for the opening stage, warm paper for services, ink for the closing scene.
3. Dela Gothic One for display, Golos Text for reading and figures; fonts hosted locally.
4. Asymmetric hero; procedure list beside a large changing character; Жмых before and after grooming; an interactive receipt.
5. The character's changing pose and indignant reply explain each procedure.

## Tokens and locks

All component colours use the role tokens in `styles.css`. One light theme is supported. The accent and its foreground are paired. Large orange fields derive their tone from the brand hue, with bounded lightness and chroma. Body text uses a dark neutral. The public interface has no theme editor.

Layout: max width 1320 px; 4 px spacing base; 4/12 px control radii. Pills only denote tags. Body 17 px. Touch targets 44 px or more. Motion is limited to short state transitions and respects reduced motion.

Interface icons must use SVG paths with currentColor or CSS geometry. Never use Unicode arrows, stars or checkmarks as UI icons: iOS can substitute colourful emoji. This applies to static markup, pseudo-elements and JavaScript-generated states. Preserve consistent sizing across mobile and desktop.

## Images

The first supplied reference establishes the shaggy black creature with large yellow-green eyes. The shower and wet fur are incidental and must not define the brand. The final user direction keeps one mascot only: Zhmykh. The separate round-headed cat was removed. The shorn pose preserves Zhmykh's own face, pointed ears, proportions and eyes. The supplied collage establishes warmth, varied expressions and domestic absurdity. No generic stock pet photographs.

## Deliberate choices

Humour, irony and fictional mascot quotes are explicitly requested. They override the skill's plain factual copy preference. Quotes are thoughts of the fictional cats, never customer testimonials. Service selection is a real actionable list. The slogan is split into short lines for poster-like rhythm. Circular branding describes grooming from every side.

This is a fictional salon. All prices are illustrative; two originate in the supplied conversation. The booking button generates a local joke ticket. No contact information, payment, appointment or personal data is collected. Legal information says this explicitly.

## Glossary

- Жмых: the single named mascot in shaggy, brushed, manicure, tooth-care and shorn states.
- Примерочная груминга: service selector and matching character image.
- Талон красоты: local joke summary, not a real booking.

## Delivery

Static HTML/CSS/JavaScript, no runtime dependencies. Use relative URLs throughout. `npm run build` validates assets and creates `dist/`. GitHub Actions publishes `dist/` to GitHub Pages.
