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
ALTER TABLE "payments" ADD COLUMN "receipt_url" varchar(255);

