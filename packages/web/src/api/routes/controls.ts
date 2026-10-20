import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../database";
import { elements, reviews, links } from "../database/schema";
import { adminProcedure } from "../middleware/auth";
const plain = z
  .string()
  .max(12000)
  .refine((v) => !/[<>]/.test(v), "Use plain text");
const url = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      !v ||
      (v.startsWith("/") && !v.startsWith("//")) ||
      v.startsWith("https://") ||
      v.startsWith("mailto:") ||
      v.startsWith("tel:") ||
      v.startsWith("#"),
    "Use an internal URL, HTTPS, email or phone link",
  );
const review = z.object({
  id: z.string(),
  name: plain.pipe(z.string().min(2)),
  company: plain,
  quote: plain.pipe(z.string().min(10)),
  quoteAr: plain,
  rating: z.number().int().min(1).max(5).nullable(),
  position: z.number().int().min(0),
  published: z.boolean(),
});
const link = z.object({
  id: z.string(),
  location: z.enum(["navigation", "footer", "social"]),
  label: plain,
  labelAr: plain,
  url,
  position: z.number().int().min(0),
  published: z.boolean(),
});
export const controls = {
  all: adminProcedure.handler(async () => ({
    elements: await db.select().from(elements),
    reviews: await db.select().from(reviews).orderBy(reviews.position),
    links: await db.select().from(links).orderBy(links.position),
  })),
  saveElement: adminProcedure
    .input(z.object({ id: z.string(), value: plain, valueAr: plain }))
    .handler(async ({ input }) => {
      const [entry] = await db.select().from(elements).where(eq(elements.id, input.id));
      if (!entry) throw new Error("Unknown content field");
      if (["image", "link"].includes(entry.kind)) url.parse(input.value);
      await db
        .update(elements)
        .set({ value: input.value, valueAr: input.valueAr })
        .where(eq(elements.id, input.id));
      return { ok: true };
    }),
  saveReview: adminProcedure.input(review).handler(async ({ input }) => {
    await db.insert(reviews).values(input).onConflictDoUpdate({ target: reviews.id, set: input });
    return { ok: true };
  }),
  removeReview: adminProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    await db.delete(reviews).where(eq(reviews.id, input.id));
    return { ok: true };
  }),
  reorder: adminProcedure
    .input(z.object({ ids: z.array(z.string()).max(1000) }))
    .handler(async ({ input }) => {
      await db.transaction(async (tx) => {
        for (const [position, id] of input.ids.entries())
          await tx.update(reviews).set({ position }).where(eq(reviews.id, id));
      });
      return { ok: true };
    }),
  saveLink: adminProcedure.input(link).handler(async ({ input }) => {
    await db.insert(links).values(input).onConflictDoUpdate({ target: links.id, set: input });
    return { ok: true };
  }),
  removeLink: adminProcedure.input(z.object({ id: z.string() })).handler(async ({ input }) => {
    await db.delete(links).where(eq(links.id, input.id));
    return { ok: true };
  }),
};
