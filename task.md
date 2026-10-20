# Build
Approved supplied reference. Exactly two equal Admins, no Super Admin. Incomplete contact email; no phone or pin: do not invent. Build relational CMS, protected auth, bilingual public routes. Catalogue illustrative. Verify build, admin access, enquiries, filtering, RTL and mobile.

## Verified
- Production build and lint pass.
- Public catalogue: 6 illustrative entries; search and brand filtering verified.
- Both admin logins verified. Unauthenticated admin redirects verified. CMS category save verified.
- Enquiry submission persisted and success state verified; QA entries removed.
- Arabic document RTL verified. Mobile drawer verified; horizontal page overflow fixed.
- Database triggers enforce exactly 2 assigned administrators and immutable email slots.

## Before launch
- Replace sample product data and verify brand assignments/logos.
- Official contact email was truncated in supplied message; phone/WhatsApp and exact map embed missing.
- Confirm production canonical domain in settings.
- Both admins should change shared initial password.
- Media upload architecture implemented with protected presigning, type/size checks and stable serving URLs; actual upload not yet browser-tested.
- Admin interface currently English; public website English/Arabic.
- Enquiries stored in CMS; automated email notifications not configured.

## Preview login fix
Verified public preview login after explicitly allowlisting proxy origin; bearer session survives cookie removal. Password unchanged.

## Refinement request
Preserve design. Compact CTA, granular bilingual copy/sections/link CMS, reusable image picker, managed published reviews with ordering, remove decorative labels/arrows, restrained hover polish. Verify CMS writes, uploads, review lifecycle, both admin accounts, mobile and RTL.

## Refinement completed / verified
- 168 granular database content controls across Homepage, Global, Catalogue and Company pages; bilingual fields and section filter/search. Navigation/footer/social links use managed link records.
- Existing product, brand, category, page/industry, settings and SEO editors retained. Technical details/specifications editable without invented specs.
- Shared image picker in all image editors: upload/replace, remove, preview and library selection. Public images follow saved references. Optional logo, contact and CTA imagery added.
- Real external-preview image upload verified; uploaded asset served HTTP 200. MIME, size and image-header checks enforced.
- Reviews add/edit/publish/unpublish/delete/reorder verified. Drafts excluded publicly. QA reviews removed; no invented customer testimonials. Honest empty section is displayed until genuine reviews are published.
- CTA desktop 132px, 34px headline. Decorative side labels/numbers removed; routine button arrows removed. Gentle image zoom/elevation and button feedback retained.
- Both admin sign-ins verified, external preview tested. Anonymous controls API rejected UNAUTHORIZED.
- Mobile and Arabic RTL no horizontal overflow. Hero field change reflected in public page; restored original copy after QA.
- Existing contact verification blockers unchanged; no details invented.

## Login / parent company follow-up
- Both accounts tested on the actual public preview with existing initial password; successful, no password resets performed.
- Clear expired bearer before fresh sign-in; normalize email only; added password visibility, assigned email suggestions, differentiated credential/origin/rate-limit/network errors, finally-cleared loading state.
- Red Star name enlarged in hero, footer company line, About affiliation, and inline English/Arabic mentions within CMS-authored About/footer copy.
- Public-preview sign-ins verified for both accounts with deliberately stale bearer; mobile no horizontal overflow; build/lint pass.

## Visitor review submission / hero removals
- Removed requested hero Professional supply label and circular down-arrow link.
- Share your experience now opens /write-review through its managed CMS destination.
- Bilingual, CMS-editable review form: name, optional company/rating, review and publication consent; confirmation after saved submission.
- Public API uses strict validation, plain text/length limits, honeypot, duplicate protection and in-memory per-proxy-IP limit of 3/hour. Visitor cannot set publication/order/IDs. Reviews stored unpublished with visitor source and submission date.
- Admin Customer reviews shows Pending approval, count, submission source/date, Approve & publish and Reject / delete. Existing editing, ordering and unpublishing preserved.
- Verified on actual public preview: requested removals, CTA route, submit → pending → hidden publicly → admin approval → public visible → unpublish → hidden → reject/delete. Both admins signed in. Mobile English/Arabic RTL no horizontal overflow. QA review removed.
- Build and lint passed. Anti-abuse rate limits are instance-local; persistent distributed limits/CAPTCHA can be added if abuse warrants them.
## Logo, readability, contact and responsiveness update
- All explicit CSS text sizes increased 10%; layout spacing preserved. Parent company is bold self-hosted Open Sans with Red / ريد in #cf5353 wherever displayed in hero/About/footer.
- Official supplied transparent logo trimmed to visible bounds, installed in header/footer/admin/login, media library and favicon. No invented artwork.
- Both phone numbers and individual WhatsApp links, plus sales.tiretech@gmail.com saved as editable settings and shown in Contact/footer.
- Contact page alone omits location Get in touch link; About/home retain it. Logo-blue selection and subtle RAF-throttled noninteractive cursor glow, disabled on touch/reduced-motion.
- Removed nested labels around uploader; aligned equal-height controls, contained previews, responsive media grid, scrollable editor. Existing upload implementation preserved.
- Public/CMS read queries parallelized, client cache lifetime increased, redundant focus refetch disabled; font stylesheet moved from CSS import to early head links with preconnect. Logo/font preloaded. No static content cache that could stale admin changes.
- Public-preview tests passed for logo/colors/font/+10% type/contact/Contact-only removal, mobile 390px and tablet 768px across pages, Arabic RTL, uploader desktop/mobile and admin login. Cached Products navigation 93–109ms, no catalogue refetch; not a cold-load performance guarantee.
- Contact form honeypot overflow fixed for RTL. Build/lint passed.

## Brands / navigation / sourced catalogue / enquiries refresh
- Inset header navigation rail, Home managed nav entry with exact-root active logic; clear active state, orange Contact CTA and mobile menu tested.
- Brands: photographic editorial intro, interactive four-brand selector, featured manufacturer/product-family previews and local sourcing CTA. Verified manufacturer logos for ELGI Rubber, Braza, REMA TIP TOP. Gee Stone remains text-only and no invented repair products assigned to it; searched Geestone site lists tyre/tube ranges, not repair patches.
- Catalogue expanded from 6 generic placeholders to 16 manufacturer-backed product families (10 additions). Existing IDs kept for incoming links/CMS featured list. Generic entries reassigned to verified ELGI product families. Braza patch families text/icon-only because official patch page uses an AdobeStock preview instead of a usable product photo; no stock photo misrepresented as real products.
- Sources: https://www.elgirubber.com/repair-system/ ; /universal-tyre-repair-units/ ; /tube-repair-units/ ; /stem-tyre-repair-units/ ; /tyre-repair-liquid/ ; /identification-units/ ; https://brazatyres.com/product/patches/ ; https://shop.rematiptop.com/bl-5f-special-blue-cement/ . Manufacturer references retained in product details. Product images downloaded from official pages to optimized local WebP. Product existence verified, TireTech inventory/authorized distribution not claimed.
- Removed requested public sample/illustrative badges and notes; replaced product descriptions/details with factual manufacturer-backed copy, not simply concealed unverified placeholder claims. Prior product records backed up in catalogue-before-refresh.json.
- RED STAR GENERAL TRADING COMPANY uppercase, bold Open Sans, all words one size, Red brighter #ef3038. Reviews redesigned with quote panel, monogram, rating/dots and honest empty invitation; approval flow unchanged, no invented testimonials.
- Lightweight route-wide reveal/hover polish respecting reduced motion; StrictMode observer reconnection bug fixed and revealed sections verified at full opacity. No heavy animation library or artificial delay.
- Enquiry delete protected admin procedure, confirm/cancel UI/loading/errors/cache refresh. Real public-preview test created QA enquiry, cancelled deletion, confirmed, verified removed after reload; anonymous delete denied 401. QA enquiry cleaned.
- Verified 390/768/1024 mobile/tablet/RTL layouts, Home menu, brand selector, 16-product search/details. Cached Products navigation 85–89ms, not a cold-load guarantee. Build and lint pass.

## Current request — catalogue expansion and 4-second reviews
- Scope confirmed: tyre repair materials, workshop tools, tubes and wheel weights; tubes/weights are best sellers. Exclude tyres and unrelated machinery.
- Review interval implemented with pause/play, hover/focus pause; browser verification pending.
- Research official ELGI repair/tool pages, Braza allied materials, Geestone tube size tables and REMA TIP TOP repair/tool/weight catalogues. Download genuine available product imagery locally; no fabricated brand assignments, inventory or specs. Preserve existing product IDs and CMS edits; back up records before additions.
- Remaining: source manifest, import additions, best-seller category shortcuts, image containment, timer/mock QA without persisting testimonials, header/reviews/mobile/RTL checks, lint/build, delivery.

## Catalogue expansion — completed (verified 2026-10-17)
- 282 product records (266 imported from official manufacturer pages), shown as 122 grouped cards; variants listed on detail pages; search matches hidden variant SKUs (e.g. RAD-122).
- Category cleanup: 26 records moved (tools out of patches/consumables, cements to vulcanizing, stems to repair materials). No records deleted, IDs preserved.
- 7 supplier "notfound" placeholder images removed; those items use a sibling photo with a photo note. Braza/Geestone records use genuine manufacturer range/packaging photos with a range note. Only elgi-liner-sealant has no photo (ELGI publishes none).
- Reviews auto-advance every 4s with horizontal slide, pause on hover/focus/button, reduced-motion respected (browser-tested with mocked reviews only).
- OG image /og-image.png (1200x630) on all SEO records + static meta + twitter card; wheel favicon (transparent) ico+png with cache-busting.
- Scripts: packages/web/catalogue-expand.ts, packages/web/catalogue-cleanup.ts; backups catalogue-*-backup.json.
