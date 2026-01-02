CREATE TABLE IF NOT EXISTS "expenses" (
	"expense_id" serial PRIMARY KEY NOT NULL,
	"expense_date" date NOT NULL,
	"category" varchar(50) NOT NULL,
	"description" text,
	"amount" numeric(10, 2) NOT NULL,
	"paid_by" varchar(100),
	"payment_method" varchar(50),
	"receipt_url" varchar(255),
	"status" varchar(20) DEFAULT 'Pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "flats" (
	"flat_id" serial PRIMARY KEY NOT NULL,
	"flat_number" varchar(10) NOT NULL,
	"floor_number" integer NOT NULL,
	"bedrooms" integer DEFAULT 1,
	"bathrooms" integer DEFAULT 1,
	"total_area" numeric(8, 2) DEFAULT '1200.00',
	"balcony" boolean DEFAULT false,
	"status" varchar(10),
	"monthly_rent" numeric(10, 2) DEFAULT '0',
	"monthly_maintenance_charge" numeric(10, 2) DEFAULT '2000',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "flats_flat_number_unique" UNIQUE("flat_number")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payments" (
	"payment_id" serial PRIMARY KEY NOT NULL,
	"flat_id" integer NOT NULL,
	"resident_id" integer NOT NULL,
	"payment_type" varchar(20),
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" date NOT NULL,
	"due_date" date,
	"status" varchar(20),
	"payment_method" varchar(50),
	"reference_number" varchar(100),
	"receipt_url" varchar(255),
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "residents" (
	"resident_id" serial PRIMARY KEY NOT NULL,
	"flat_id" integer NOT NULL,
	"first_name" varchar(50) NOT NULL,
	"last_name" varchar(50) NOT NULL,
	"email" varchar(100),
	"phone" varchar(20),
	"lease_start_date" date NOT NULL,
	"lease_end_date" date,
	"is_primary_tenant" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "residents_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transaction_history" (
	"transaction_id" serial PRIMARY KEY NOT NULL,
	"apartment_id" varchar(255) NOT NULL,
	"transaction_type" varchar(50) NOT NULL,
	"payment_id" integer,
	"expense_id" integer,
	"amount" numeric(12, 2) NOT NULL,
	"outstanding_balance" numeric(12, 2) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(10),
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_flat_id_flats_flat_id_fk" FOREIGN KEY ("flat_id") REFERENCES "public"."flats"("flat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payments" ADD CONSTRAINT "payments_resident_id_residents_resident_id_fk" FOREIGN KEY ("resident_id") REFERENCES "public"."residents"("resident_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "residents" ADD CONSTRAINT "residents_flat_id_flats_flat_id_fk" FOREIGN KEY ("flat_id") REFERENCES "public"."flats"("flat_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
