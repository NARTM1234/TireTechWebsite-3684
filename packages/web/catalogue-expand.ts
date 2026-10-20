import { db } from "./src/api/database";
import * as s from "./src/api/database/schema";

const additions = await Bun.file("/home/user/tiretech/catalogue-additions.json").json();
const categories = [
  { id: "tools", name: "Workshop Tools", nameAr: "أدوات الورش" },
  { id: "tubes", name: "Inner Tubes & Flaps", nameAr: "الأنابيب الداخلية وشرائط الحماية" },
  { id: "wheel-weights", name: "Wheel Weights", nameAr: "أوزان ترصيص العجلات" },
];
for (const category of categories) await db.insert(s.categories).values(category).onConflictDoNothing();
let inserted = 0;
for (const item of additions) {
  const { source: _source, sourceImage: _image, ...product } = item;
  const rows = await db.insert(s.products).values(product).onConflictDoNothing().returning({ id: s.products.id });
  inserted += rows.length;
  if (product.image) await db.insert(s.media).values({ id: "catalogue-" + product.id, name: product.name, url: product.image, alt: product.name, altAr: product.nameAr }).onConflictDoNothing();
}
console.log(JSON.stringify({ inserted, total: (await db.select().from(s.products)).length, categories: (await db.select().from(s.categories)).length }));