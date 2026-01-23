CREATE TABLE IF NOT EXISTS "vehicles" (
	"vehicle_id" serial PRIMARY KEY NOT NULL,
	"flat_id" integer NOT NULL,
	"resident_id" integer,
	"vehicle_type" varchar(20) NOT NULL,
	"fuel_type" varchar(20),
	"registration_number" varchar(50),
	"make" varchar(50),
	"model" varchar(50),
	"color" varchar(30),
	"status" varchar(20) DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "residents" ADD COLUMN "relation" varchar(20);--> statement-breakpoint
ALTER TABLE "residents" ADD COLUMN "age_category" varchar(20);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_flat_id_flats_flat_id_fk" FOREIGN KEY ("flat_id") REFERENCES "public"."flats"("flat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehicles" ADD CONSTRAINT "vehicles_resident_id_residents_resident_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("resident_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_flat_id_idx" ON "vehicles" USING btree ("flat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_resident_id_idx" ON "vehicles" USING btree ("resident_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_type_idx" ON "vehicles" USING btree ("vehicle_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_status_idx" ON "vehicles" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "vehicles_flat_status_idx" ON "vehicles" USING btree ("flat_id","status");