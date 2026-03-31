import { pgTable, serial, text, varchar, timestamp, boolean, jsonb, integer } from "drizzle-orm/pg-core";

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"), // This will be the cover image (first from gallery)
  logoUrl: text("logo_url"),
  projectUrl: text("project_url"),
  gallery: jsonb("gallery").$type<string[]>().default([]),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  companyLogo: text("company_logo"),
  period: varchar("period", { length: 100 }).notNull(),
  description: text("description").notNull(),
  isCurrent: boolean("is_current").default(false),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contactUrls = pgTable("contact_urls", {
  id: serial("id").primaryKey(),
  platform: varchar("platform", { length: 100 }).notNull(),
  url: text("url").notNull(),
  icon: varchar("icon", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backgroundKeyframes = pgTable("background_keyframes", {
  id: serial("id").primaryKey(),
  scrollPercent: integer("scroll_percent").notNull(), // 0 to 100
  posX: text("pos_x").notNull().default("0"),
  posY: text("pos_y").notNull().default("0"),
  posZ: text("pos_z").notNull().default("0"),
  rotX: text("rot_x").notNull().default("0"),
  rotY: text("rot_y").notNull().default("0"),
  rotZ: text("rot_z").notNull().default("0"),
  scale: text("scale").notNull().default("1"),
  createdAt: timestamp("created_at").defaultNow(),
});
