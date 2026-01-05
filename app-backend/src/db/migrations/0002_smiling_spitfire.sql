ALTER TABLE "payments" ADD COLUMN "resident_id" integer NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_resident_id_residents_resident_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("resident_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

