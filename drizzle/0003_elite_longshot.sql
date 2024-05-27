ALTER TABLE "auction" RENAME TO "bid";--> statement-breakpoint
ALTER TABLE "bid" DROP CONSTRAINT "auction_userId_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "bid" ADD CONSTRAINT "bid_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
