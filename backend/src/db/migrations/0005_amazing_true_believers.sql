CREATE TABLE IF NOT EXISTS "ledger" (
	"ledger_id" serial PRIMARY KEY NOT NULL,
	"transaction_date" date NOT NULL,
	"entry_type" varchar(10) NOT NULL,
	"category" varchar(50) NOT NULL,
	"flat_id" integer,
	"resident_id" integer,
	"due_date" date,
	"expense_category" varchar(50),
	"paid_by" varchar(100),
	"amount" numeric(12, 2) NOT NULL,
	"description" text,
	"payment_method" varchar(50),
	"reference_number" varchar(100),
	"receipt_url" varchar(255),
	"status" varchar(20) DEFAULT 'pending' NOT NULL,
	"running_balance" numeric(12, 2),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"created_by" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger" ADD CONSTRAINT "ledger_flat_id_flats_flat_id_fk" FOREIGN KEY ("flat_id") REFERENCES "public"."flats"("flat_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger" ADD CONSTRAINT "ledger_resident_id_residents_resident_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("resident_id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "ledger" ADD CONSTRAINT "ledger_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
