CREATE TABLE IF NOT EXISTS "background_keyframes" (
	"id" serial PRIMARY KEY NOT NULL,
	"section_id" varchar(100) NOT NULL,
	"pos_x" text DEFAULT '0' NOT NULL,
	"pos_y" text DEFAULT '0' NOT NULL,
	"pos_z" text DEFAULT '0' NOT NULL,
	"rot_x" text DEFAULT '0' NOT NULL,
	"rot_y" text DEFAULT '0' NOT NULL,
	"rot_z" text DEFAULT '0' NOT NULL,
	"scale" text DEFAULT '1' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
