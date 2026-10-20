import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export * from "./auth-schema";
export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  image: text("image").notNull().default(""),
});
export const categories = sqliteTable("categories", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
});
export const products = sqliteTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameAr: text("name_ar").notNull(),
  brandId: text("brand_id")
    .references(() => brands.id, { onDelete: "restrict" })
    .notNull(),
  categoryId: text("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  details: text("details").notNull(),
  detailsAr: text("details_ar").notNull(),
  image: text("image").notNull(),
  illustrative: integer("illustrative", { mode: "boolean" }).notNull().default(true),
});
export const content = sqliteTable("content", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  body: text("body").notNull(),
  bodyAr: text("body_ar").notNull(),
  image: text("image").notNull().default(""),
});
export const settings = sqliteTable("settings", {
  id: text("id").primaryKey(),
  value: text("value").notNull(),
});
export const seo = sqliteTable("seo", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  titleAr: text("title_ar").notNull(),
  description: text("description").notNull(),
  descriptionAr: text("description_ar").notNull(),
  image: text("image").notNull().default("/images/hero.webp"),
});
export const media = sqliteTable("media", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  url: text("url").notNull(),
  alt: text("alt").notNull(),
  altAr: text("alt_ar").notNull(),
});
export const enquiries = sqliteTable("enquiries", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  type: text("type").notNull(),
  product: text("product").notNull(),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"),
  createdAt: text("created_at").notNull(),
});

export const elements = sqliteTable("elements", {
  id: text("id").primaryKey(),
  group: text("group_name").notNull(),
  section: text("section_name").notNull(),
  label: text("label").notNull(),
  kind: text("kind").notNull(),
  source: text("source").notNull().default(""),
  value: text("value").notNull(),
  valueAr: text("value_ar").notNull().default(""),
});
export const reviews = sqliteTable("reviews", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company").notNull().default(""),
  quote: text("quote").notNull(),
  quoteAr: text("quote_ar").notNull().default(""),
  rating: integer("rating"),
  position: integer("position").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  source: text("source").notNull().default("admin"),
  createdAt: text("created_at").notNull().default(""),
});
export const links = sqliteTable("links", {
  id: text("id").primaryKey(),
  location: text("location").notNull(),
  label: text("label").notNull(),
  labelAr: text("label_ar").notNull(),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
  published: integer("published", { mode: "boolean" }).notNull().default(true),
});
