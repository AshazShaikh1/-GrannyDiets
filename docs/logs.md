# Redesign Logs

## Date: 2026-07-25
- **Redesign Implementation for About & Contact Pages**
- Modified `src/app/(storefront)/about/page.tsx`:
  - Removed oversized gradient hero and replaced with clean title/text layout.
  - Centered story typography and removed heavy colored cards for values.
  - Values section modernized into a clean flex grid with minimal Lucide icons.
  - Counter section simplified to blend into a flat layout with a Visit Store button.
  - Maintained `framer-motion` for subtle staggered fade/upward motion.
- Modified `src/app/(storefront)/contact/page.tsx`:
  - Implemented unboxed, two-column layout.
  - Left column: Address, Phone, Email with lightweight icons.
  - Right column: Google Map embed.
  - Form section: Flattened out of the card.
- Modified `src/features/storefront/components/contact-form.tsx`:
  - Split "Full Name" into First and Last name.
  - Added optional Phone field.
  - Added Sonner toast for success notification.
  - Button aligned to the left.
- Mobile QA tested via Tailwind flex column wrapping.
- Accessibility maintained via clean semantics and labels.
