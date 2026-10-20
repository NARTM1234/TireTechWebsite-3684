type Product = { id: string; name: string; nameAr: string; brandId: string; categoryId: string; image: string };

const lists: Record<string, string[]> = {
  "rema-minicombi-family": ["rema-a-3", "rema-a-3-r", "rema-a-4-5", "rema-a-6", "rema-a-6-r", "rema-b-10", "rema-b-10-r", "rema-b-8-r", "rema-b-8mc"],
  "rema-tube-patch-family": ["rema-0", "rema-1", "rema-2", "rema-3", "rema-4", "rema-5", "rema-6", "rema-7", "rema-7b", "rema-b-0", "rema-b-1", "rema-b-2", "rema-b-3", "rema-b-7", "rema-b-7b", "rema-f0-p", "rema-f1-p", "rema-f2-p"],
  "rema-stem-family": ["rema-193-wl-10", "rema-193-wl-50", "rema-194", "rema-194b", "rema-rs-8", "rema-rs-10", "rema-rs-12"],
  "rema-qr-arbor-family": ["rema-6066", "rema-6067"],
  "rema-qr-adapter-family": ["rema-5196593", "rema-6068", "rema-6068-125", "rema-6068-5", "rema-6069"],
  "rema-blue-cement-family": ["rema-special-blue-cement", "rema-101000037", "rema-101000038"],
  "rema-vulcanizing-cement-family": ["rema-f0-f", "rema-f1-f"],
  "rema-cold-fluid-family": ["rema-101000029", "rema-101000030"],
  "rema-bead-butter-family": ["rema-101000009", "rema-101000010", "rema-101000018"],
  "rema-liquid-lube-family": ["rema-101000016", "rema-101000017", "rema-101000019", "rema-101000021"],
  "rema-otr-mounting-family": ["rema-101000015", "rema-101000020"],
  "rema-mounting-compound-family": ["rema-101000002", "rema-101000004", "rema-101000006", "rema-101000007", "rema-101000011", "rema-101000012", "rema-101000013", "rema-101000014"],
  "rema-mounting-paste-family": ["rema-101000074", "rema-101000075", "rema-101000076"],
  "rema-pre-buff-family": ["rema-70f", "rema-101000089"],
  "rema-paste-brush-family": ["rema-73", "rema-73t", "rema-104000073"],
  "rema-paste-bracket-family": ["rema-75b", "rema-75nb"],
  "rema-lube-bucket-family": ["rema-28752", "rema-78752"],
  "rema-hand-rasp-family": ["rema-199", "rema-1-r", "rema-2-r"],
  "rema-stitcher-family": ["rema-30", "rema-30-gn", "rema-6004", "rema-6005-e", "rema-6005-gn"],
  "rema-skive-knife-family": ["rema-6017", "rema-6018", "rema-930", "rema-101000929"],
  "rema-router-family": ["rema-6454", "rema-6455", "rema-6457", "rema-6458"],
  "rema-buffing-stone-family": ["rema-742", "rema-744", "rema-745", "rema-746"],
  "rema-wire-wheel-family": ["rema-6055", "rema-6056"],
  "rema-buffing-rasp-family": ["rema-tcw210-60v", "rema-tcw210-80"],
  "rema-scraper-family": ["rema-28", "rema-932"],
  "rema-gouge-family": ["rema-6424", "rema-6425", "rema-6426"],
  "rema-hammer-handle-family": ["rema-950", "rema-952"],
  "rema-wheel-weight-tool-family": ["rema-uwt-pliers", "rema-uwt-tool-rk", "rema-924"],
};
const lookup = new Map(Object.entries(lists).flatMap(([family, ids]) => ids.map((id) => [id, family] as const)));

export function productFamily(product: Pick<Product, "id" | "brandId">): string {
  const id = product.id;
  if (product.brandId !== "tip-top") return id;
  const listed = lookup.get(id);
  if (listed) return listed;
  if (id.startsWith("rema-rad-")) return id.includes("aramid") ? "rema-rad-aramid-family" : "rema-rad-family";
  if (id.startsWith("rema-pn-")) return "rema-pn-family";
  if (id.startsWith("rema-cc-")) return "rema-carbide-cutter-family";
  if (id.startsWith("rema-up")) return "rema-universal-family";
  if (id.startsWith("rema-2990")) return "rema-lube-applicator-family";
  return id;
}

const labels: Record<string, [string, string]> = {
  "rema-rad-family": ["Radial repair units — RAD series", "وحدات الإصلاح الشعاعية — سلسلة RAD"],
  "rema-rad-aramid-family": ["Aramid radial repair units", "وحدات الإصلاح الشعاعية بالأراميد"],
  "rema-pn-family": ["Bias repair units — PN series", "وحدات الإصلاح القطرية — سلسلة PN"],
  "rema-carbide-cutter-family": ["Carbide injury cutters", "قواطع كربيد لمواضع الضرر"],
  "rema-minicombi-family": ["MINICOMBI combination repairs", "وحدات الإصلاح المركبة MINICOMBI"],
  "rema-stem-family": ["Tyre repair stems", "سيقان إصلاح الإطارات"],
  "rema-tube-patch-family": ["Tube patches — round, oval & bicycle", "رقع الأنابيب — دائرية وبيضاوية وللدراجات"],
  "rema-universal-family": ["Universal repair units", "وحدات الإصلاح متعددة الاستخدام"],
  "rema-qr-arbor-family": ["Threaded quick-release arbors", "حوامل ملولبة سريعة التحرير"],
  "rema-lube-applicator-family": ["Tyre lubricant applicators", "أدوات تطبيق مواد تركيب الإطارات"],
  "rema-blue-cement-family": ["Special Blue Cement", "أسمنت الفلكنة الأزرق"],
  "rema-cold-fluid-family": ["Cold vulcanizing fluid", "سائل الفلكنة الباردة"],
  "rema-bead-butter-family": ["Bead Butter mounting lubricant", "مادة تركيب الحواف Bead Butter"],
  "rema-liquid-lube-family": ["Liquid tyre mounting lubricant", "سائل تركيب الإطارات"],
  "rema-otr-mounting-family": ["OTR tyre mounting compound", "مركب تركيب إطارات الطرق الوعرة"],
  "rema-mounting-paste-family": ["Universal mounting paste", "معجون تركيب متعدد الاستخدام"],
  "rema-qr-adapter-family": ["Quick-release cutter adapters", "محولات سريعة التحرير للقواطع"],
  "rema-vulcanizing-cement-family": ["Vulcanizing cement — F series", "أسمنت الفلكنة — سلسلة F"],
  "rema-mounting-compound-family": ["Concentrated mounting compound", "مركب تركيب مركّز"],
  "rema-pre-buff-family": ["Pre-buff cleaner", "منظف ما قبل الصنفرة"],
  "rema-paste-brush-family": ["Mounting paste brushes", "فرش معجون التركيب"],
  "rema-paste-bracket-family": ["Mounting paste pail brackets", "حوامل علب معجون التركيب"],
  "rema-lube-bucket-family": ["Tyre changer lube buckets", "علب مواد التشحيم لآلات تغيير الإطارات"],
  "rema-hand-rasp-family": ["Stickleback hand rasps", "مبارد يدوية Stickleback"],
  "rema-stitcher-family": ["Hand stitchers", "أدوات الكبس اليدوية"],
  "rema-skive-knife-family": ["Skiving knives", "سكاكين التقشير"],
  "rema-router-family": ["Carbide routers & dressers", "أدوات توجيه وتسوية كربيد"],
  "rema-buffing-stone-family": ["Buffing stones", "أحجار الصنفرة"],
  "rema-wire-wheel-family": ["Encapsulated wire wheels", "عجلات سلكية مغلفة"],
  "rema-buffing-rasp-family": ["Carbide cup buffing rasps", "مبارد صنفرة كأسية كربيد"],
  "rema-scraper-family": ["Rubber scrapers", "مكاشط المطاط"],
  "rema-gouge-family": ["Rotary gouges — thin wall & OTR", "أدوات حفر دوارة — رقيقة وللطرق الوعرة"],
  "rema-hammer-handle-family": ["Tyre hammer handles", "مقابض مطارق الإطارات"],
  "rema-wheel-weight-tool-family": ["Wheel weight tools", "أدوات أوزان العجلات"],
};

export function groupProducts<T extends Product>(products: T[]) {
  const groups = new Map<string, T[]>();
  for (const product of products) {
    const key = productFamily(product);
    groups.set(key, [...(groups.get(key) || []), product]);
  }
  return Array.from(groups.entries()).map(([key, variants]) => {
    const first = variants.find((p) => p.image && !p.image.includes("range")) || variants[0];
    const label = variants.length > 1 ? labels[key] : undefined;
    return { ...first, name: label?.[0] || first.name, nameAr: label?.[1] || first.nameAr, variants: variants.length, searchText: variants.flatMap((p) => [p.id, p.name, p.nameAr]).join(" ") };
  });
}