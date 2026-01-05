ALTER TABLE "residents" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "residents" ADD COLUMN "resident_type" varchar(10) DEFAULT 'tenant';--> statement-breakpoint
ALTER TABLE "residents" ADD COLUMN "status" varchar(20) DEFAULT 'active' NOT NULL;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "residents_flat_id_idx" ON "residents" USING btree ("flat_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "residents_lease_dates_idx" ON "residents" USING btree ("lease_start_date","lease_end_date");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "residents_type_idx" ON "residents" USING btree ("resident_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "residents_status_idx" ON "residents" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "residents_flat_status_idx" ON "residents" USING btree ("flat_id","status");