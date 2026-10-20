import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../database";
import * as s from "../database/schema";
import { adminProcedure } from "../middleware/auth";
import { ORPCError } from "@orpc/server";
const text = z
  .string()
  .trim()
  .max(12000)
  .refine((v) => !/[<>]/.test(v), "Plain text only");
const image = z
  .string()
  .max(2000)
  .refine(
    (v) =>
      !v || v.startsWith("/images/") || v.startsWith("/api/media/") || v.startsWith("https://"),
    "Use a local image or HTTPS URL",
  );
const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,150}$/);
const product = z.object({
  id,
  name: text,
  nameAr: text,
  brandId: text,
  categoryId: text,
  description: text,
  descriptionAr: text,
  details: text,
  detailsAr: text,
  image,
  illustrative: z.boolean(),
});
const brand = z.object({
  id,
  name: text,
  nameAr: text,
  description: text,
  descriptionAr: text,
  image,
});
const category = z.object({ id, name: text, nameAr: text });
const page = z.object({
  id,
  type: z.enum(["page", "homepage", "industry", "footer"]),
  title: text,
  titleAr: text,
  body: text,
  bodyAr: text,
  image,
});
const seo = z.object({
  id: text,
  title: text,
  titleAr: text,
  description: text,
  descriptionAr: text,
  image,
});
const media = z.object({ id, name: text, url: image, alt: text, altAr: text });
export const cms = {
  me: adminProcedure.handler(({ context }) => ({
    email: context.user.email,
    name: context.user.name,
    role: "Admin",
  })),
  all: adminProcedure.handler(async () => {
    const [products, brands, categories, content, seo, media, enquiries, settings] = await Promise.all([
      db.select().from(s.products), db.select().from(s.brands), db.select().from(s.categories),
      db.select().from(s.content), db.select().from(s.seo), db.select().from(s.media),
      db.select().from(s.enquiries), db.select().from(s.settings),
    ]);
    return { products, brands, categories, content, seo, media, enquiries, settings };
  }),
  save: adminProcedure
    .input(
      z.discriminatedUnion("table", [
        z.object({ table: z.literal("products"), data: product }),
        z.object({ table: z.literal("brands"), data: brand }),
        z.object({ table: z.literal("categories"), data: category }),
        z.object({ table: z.literal("content"), data: page }),
        z.object({ table: z.literal("seo"), data: seo }),
        z.object({ table: z.literal("media"), data: media }),
        z.object({ table: z.literal("settings"), data: z.object({ id, value: text }) }),
      ]),
    )
    .handler(async ({ input }) => {
      try {
        switch (input.table) {
          case "products":
            await db
              .insert(s.products)
              .values(input.data)
              .onConflictDoUpdate({ target: s.products.id, set: input.data });
            break;
          case "brands":
            await db
              .insert(s.brands)
              .values(input.data)
              .onConflictDoUpdate({ target: s.brands.id, set: input.data });
            break;
          case "categories":
            await db
              .insert(s.categories)
              .values(input.data)
              .onConflictDoUpdate({ target: s.categories.id, set: input.data });
            break;
          case "content":
            await db
              .insert(s.content)
              .values(input.data)
              .onConflictDoUpdate({ target: s.content.id, set: input.data });
            break;
          case "seo":
            await db
              .insert(s.seo)
              .values(input.data)
              .onConflictDoUpdate({ target: s.seo.id, set: input.data });
            break;
          case "media":
            await db
              .insert(s.media)
              .values(input.data)
              .onConflictDoUpdate({ target: s.media.id, set: input.data });
            break;
          case "settings":
            if (
              ["whatsapp", "whatsapp-2"].includes(input.data.id) &&
              input.data.value &&
              !/^\d{8,15}$/.test(input.data.value)
            )
              throw new Error("Use international digits only");
            if (
              ["map-url", "canonical-base"].includes(input.data.id) &&
              input.data.value &&
              !input.data.value.startsWith("https://")
            )
              throw new Error("Use HTTPS");
            await db
              .insert(s.settings)
              .values(input.data)
              .onConflictDoUpdate({ target: s.settings.id, set: input.data });
            break;
        }
        return { ok: true };
      } catch (e) {
        throw new ORPCError("BAD_REQUEST", {
          message: e instanceof Error ? e.message : "Unable to save",
        });
      }
    }),
  remove: adminProcedure
    .input(
      z.object({
        table: z.enum(["products", "brands", "categories", "content", "seo", "media"]),
        id: text,
      }),
    )
    .handler(async ({ input }) => {
      try {
        const t = s[input.table];
        await db.delete(t).where(eq(t.id, input.id));
        return { ok: true };
      } catch {
        throw new ORPCError("CONFLICT", { message: "Remove associated products first." });
      }
    }),
  deleteEnquiry: adminProcedure.input(z.object({ id: z.string().min(1) })).handler(async ({ input }) => {
    await db.delete(s.enquiries).where(eq(s.enquiries.id, input.id));
    return { ok: true };
  }),
  enquiryStatus: adminProcedure
    .input(z.object({ id: z.string(), status: z.enum(["new", "in-progress", "closed"]) }))
    .handler(async ({ input }) => {
      await db
        .update(s.enquiries)
        .set({ status: input.status })
        .where(eq(s.enquiries.id, input.id));
      return { ok: true };
    }),
};
