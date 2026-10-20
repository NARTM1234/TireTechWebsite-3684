import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { eq, max } from "drizzle-orm";
import { base } from "../__core/app";
import { db } from "../database";
import { reviews } from "../database/schema";

const limits = new Map<string, number[]>();
const plain = (min: number, limit: number) => z.string().trim().min(min).max(limit)
  .refine((value) => !/[<>]/.test(value), "Please use plain text");

export const reviewSubmissions = {
  submit: base.input(z.object({
    name: plain(2, 120),
    company: plain(0, 150),
    quote: plain(10, 3000),
    rating: z.number().int().min(1).max(5).nullable(),
    language: z.enum(["en", "ar"]),
    website: z.string().max(0),
    consent: z.literal(true),
  }).strict()).handler(async ({ input, context }) => {
    const now = Date.now();
    // Proxy IPs are supplied by the hosting infrastructure, not by the form.
    const key = context.headers.get("x-real-ip") || context.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    for (const [ip, times] of limits) {
      const recent = times.filter((time) => now - time < 3600000);
      if (recent.length) limits.set(ip, recent); else limits.delete(ip);
    }
    const times = limits.get(key) || [];
    if (times.length >= 3 || limits.size > 10000)
      throw new ORPCError("TOO_MANY_REQUESTS", { message: "Please try again later." });
    limits.set(key, [...times, now]);
    const duplicate = await db.select({ id: reviews.id }).from(reviews).where(eq(reviews.quote, input.quote)).limit(1);
    if (duplicate.length) throw new ORPCError("CONFLICT", { message: "This review has already been submitted." });
    const [last] = await db.select({ position: max(reviews.position) }).from(reviews);
    await db.insert(reviews).values({
      id: crypto.randomUUID(), name: input.name, company: input.company,
      quote: input.quote, quoteAr: input.language === "ar" ? input.quote : "",
      rating: input.rating, position: (last?.position ?? -1) + 1,
      published: false, source: "visitor", createdAt: new Date().toISOString(),
    });
    return { ok: true };
  }),
};