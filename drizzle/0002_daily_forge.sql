CREATE TABLE IF NOT EXISTS "auction" (
	"id" text PRIMARY KEY NOT NULL,
	"row" integer NOT NULL,
	"col" integer NOT NULL,
	"userId" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"confirmed" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "marketItem" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"sellingPrice" integer NOT NULL,
	"buyingPrice" integer NOT NULL,
	"image" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "team" text;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "auction" ADD CONSTRAINT "auction_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
