import { db } from "./src/api/database";
import * as s from "./src/api/database/schema";
import { eq } from "drizzle-orm";

// 1. Category corrections (IDs preserved, nothing deleted)
const moves: Record<string, string> = {
  "rema-190": "tools",
  "rema-199": "tools",
  "rema-f0-f": "vulcanizing",
  "rema-f1-f": "vulcanizing",
  "rema-77": "consumables",
  "rema-6020": "tools",
  "rema-6021": "tools",
  "rema-104000073": "tools",
  "rema-28752": "tools",
  "rema-2990": "tools",
  "rema-2990-15": "tools",
  "rema-2990-18": "tools",
  "rema-73": "tools",
  "rema-73t": "tools",
  "rema-75b": "tools",
  "rema-75nb": "tools",
  "rema-78752": "tools",
  // tyre repair stems belong with ELGI stem units, not patches
  "rema-193-wl-10": "repair-materials",
  "rema-193-wl-50": "repair-materials",
  "rema-194": "repair-materials",
  "rema-194b": "repair-materials",
  "rema-rs-8": "repair-materials",
  "rema-rs-10": "repair-materials",
  "rema-rs-12": "repair-materials",
  // ELGI liquids sit with the other repair liquids
  "elgi-liner-sealant": "vulcanizing",
  "elgi-rim-sealant": "consumables",
};

const relatedNote = {
  en: "Photo note: the manufacturer has not published a separate photo for this exact item — the image shows a closely related size from the same family.",
  ar: "ملاحظة الصورة: لم تنشر الشركة المصنعة صورة منفصلة لهذا الصنف تحديدًا — الصورة لمقاس قريب من نفس المجموعة.",
};
const rangeNote = {
  en: "Photo note: manufacturer range / packaging photograph — not a specific size, valve or pack.",
  ar: "ملاحظة الصورة: صورة لمجموعة أو تغليف الشركة المصنعة — وليست لمقاس أو صمام أو عبوة محددة.",
};

// 2. Supplier placeholder images ("notfound.png") replaced by a sibling photo with an honest note
const placeholderFix: Record<string, string> = {
  "rema-cc-17": "rema-cc-12",
  "rema-tcw210-60v": "rema-tcw210-80",
  "rema-101000011": "rema-101000012",
  "rema-101000018": "rema-101000010",
  "rema-101000019": "rema-101000017",
  "rema-rad-185-plus": "rema-rad-175",
  "rema-pn-058s-plus": "rema-pn-058-plus",
};

// 3. Missing images filled with genuine manufacturer photographs
const geestone = "/images/products/geestone-tube-packaging-range.webp";
const imageFill: Record<string, [string, "range" | "exact"]> = {
  "braza-butyl-tubes": ["/images/products/braza-butyl-tubes.webp", "range"],
  "braza-rim-flaps": ["/images/products/braza-rim-flaps.webp", "range"],
  "braza-bonding-gum": ["/images/products/braza-bonding-gum.webp", "range"],
  "braza-radial-patches": ["/images/products/braza-patch-range.webp", "range"],
  "braza-nylon-ply-patches": ["/images/products/braza-repair-patch-range.webp", "range"],
  "braza-otr-patches": ["/images/products/braza-repair-patch-range.webp", "range"],
  "braza-tube-patches": ["/images/products/braza-repair-patch-range.webp", "range"],
  "geestone-motorcycle-tubes": [geestone, "range"],
  "geestone-car-tubes": [geestone, "range"],
  "geestone-light-truck-tubes": [geestone, "range"],
  "geestone-truck-bus-tubes": [geestone, "range"],
  "geestone-industrial-tubes": [geestone, "range"],
  "geestone-implement-tubes": [geestone, "range"],
  "geestone-otr-tubes": [geestone, "range"],
  "geestone-adv-tubes": [geestone, "range"],
  "geestone-tractor-tubes": [geestone, "range"],
};

const all = await db.select().from(s.products);
const byId = new Map(all.map((p) => [p.id, p]));
const withNote = (text: string, note: string) => (text.includes(note.slice(0, 20)) ? text : note + "\n\n" + text);
let changed = 0;

for (const [id, categoryId] of Object.entries(moves)) {
  if (!byId.has(id)) throw new Error("missing " + id);
  await db.update(s.products).set({ categoryId }).where(eq(s.products.id, id));
  changed++;
}
for (const [id, sibling] of Object.entries(placeholderFix)) {
  const p = byId.get(id)!;
  const src = byId.get(sibling)!;
  await db
    .update(s.products)
    .set({ image: src.image, illustrative: true, details: withNote(p.details, relatedNote.en), detailsAr: withNote(p.detailsAr, relatedNote.ar) })
    .where(eq(s.products.id, id));
  changed++;
}
for (const [id, [image]] of Object.entries(imageFill)) {
  const p = byId.get(id);
  if (!p) throw new Error("missing " + id);
  if (!(await Bun.file("public" + image).exists()) && !(await Bun.file("packages/web/public" + image).exists())) throw new Error("no file " + image);
  await db
    .update(s.products)
    .set({ image, illustrative: true, details: withNote(p.details, rangeNote.en), detailsAr: withNote(p.detailsAr, rangeNote.ar) })
    .where(eq(s.products.id, id));
  await db.insert(s.media).values({ id: "catalogue-" + id, name: p.name, url: image, alt: p.name, altAr: p.nameAr }).onConflictDoNothing();
  changed++;
}

// 4. Shared OG image on every SEO record
await db.update(s.seo).set({ image: "/og-image.png" });

const after = await db.select().from(s.products);
console.log(JSON.stringify({ changed, total: after.length, missingImages: after.filter((p) => !p.image).map((p) => p.id) }));
