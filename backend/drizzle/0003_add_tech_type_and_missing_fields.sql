ALTER TABLE "projects" ADD COLUMN "tech_type" varchar(50) DEFAULT 'custom';
ALTER TABLE "projects" ADD COLUMN "logo_url" text;
ALTER TABLE "projects" ADD COLUMN "gallery" jsonb DEFAULT '[]'::jsonb;
ALTER TABLE "experience" ADD COLUMN "company_logo" text;
