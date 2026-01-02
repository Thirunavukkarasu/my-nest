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
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"mobile" varchar(10),
	"password" varchar(255) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);

