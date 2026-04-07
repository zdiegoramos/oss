ALTER TABLE "user" ADD COLUMN "nano_id" varchar(11) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_nano_id_unique" UNIQUE("nano_id");