import { eq } from "drizzle-orm";
import { z } from "zod";
import { base } from "../__core/app";
import { db } from "../database";
import * as s from "../database/schema";
import { ORPCError } from "@orpc/server";
const limits = new Map<string, number[]>();
const clean = z
  .string()
  .trim()
  .max(3000)
  .refine((v) => !/[<>]/.test(v), "Please use plain text");
export const catalogue = {
  all: base.handler(async () => {
    const [products, brands, categories, content, settings, seo, elements, reviews, links] = await Promise.all([
      db.select().from(s.products), db.select().from(s.brands), db.select().from(s.categories),
      db.select().from(s.content), db.select().from(s.settings), db.select().from(s.seo),
      db.select().from(s.elements), db.select().from(s.reviews).where(eq(s.reviews.published, true)).orderBy(s.reviews.position),
      db.select().from(s.links).where(eq(s.links.published, true)).orderBy(s.links.position),
    ]);
    return { products, brands, categories, content, settings: Object.fromEntries(settings.map((x) => [x.id, x.value])), seo, elements, reviews, links };
  }),
  enquire: base
    .input(
      z.object({
        name: clean.pipe(z.string().min(2).max(120)),
        company: clean.pipe(z.string().min(2).max(150)),
        phone: clean.pipe(z.string().min(6).max(40)),
        email: z.email().max(254),
        type: clean.pipe(z.string().min(1).max(100)),
        product: clean.pipe(z.string().max(200)),
        message: clean.pipe(z.string().min(10)),
        website: z.string().max(0),
      }),
    )
    .handler(async ({ input }) => {
      const key = input.email.toLowerCase();
      const now = Date.now();
      const times = (limits.get(key) || []).filter((t) => now - t < 3600000);
      if (times.length >= 5)
        throw new ORPCError("TOO_MANY_REQUESTS", { message: "Please try again later." });
      times.push(now);
      limits.set(key, times);
      const id = crypto.randomUUID();
      const { website: _website, ...values } = input;
      await db.insert(s.enquiries).values({ ...values, id, createdAt: new Date().toISOString() });
      return { id };
    }),
};
