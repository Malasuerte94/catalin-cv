import { pgTable, serial, text, varchar, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";

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
  imageUrl: text("image_url"),
  projectUrl: text("project_url"),
  tags: jsonb("tags").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const experience = pgTable("experience", {
  id: serial("id").primaryKey(),
  role: varchar("role", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
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
