CREATE TABLE IF NOT EXISTS "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contact_urls" (
	"id" serial PRIMARY KEY NOT NULL,
	"platform" varchar(100) NOT NULL,
	"url" text NOT NULL,
	"icon" varchar(100),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"role" varchar(255) NOT NULL,
	"company" varchar(255) NOT NULL,
	"period" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"is_current" boolean DEFAULT false,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"image_url" text,
	"project_url" text,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp DEFAULT now()
);
