CREATE TYPE "public"."card_brand" AS ENUM('visa', 'mastercard', 'amex', 'discover', 'unknown');--> statement-breakpoint
CREATE TYPE "public"."expiry_month" AS ENUM('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');--> statement-breakpoint
CREATE TYPE "public"."plan_type" AS ENUM('basic', 'pro');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."widget_category" AS ENUM('basic', 'advanced', 'premium');--> statement-breakpoint
CREATE TABLE "account" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "account_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" bigint NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "address" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "address_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"credit_card_id" bigint NOT NULL,
	"line1" varchar(200) NOT NULL,
	"line2" varchar(200),
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"country" varchar(100) NOT NULL,
	CONSTRAINT "address_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "bug" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "bug_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" varchar(1000) NOT NULL,
	CONSTRAINT "bug_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "credit_card" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "credit_card_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"cardholder_name" varchar(100) NOT NULL,
	"last_four_digits" varchar(4) NOT NULL,
	"expiry_month" "expiry_month" NOT NULL,
	"expiry_year" varchar(4) NOT NULL,
	"brand" "card_brand" DEFAULT 'unknown' NOT NULL,
	CONSTRAINT "credit_card_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "invoice" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "invoice_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"merchant" varchar(200) NOT NULL,
	"date" timestamp with time zone NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"currency" varchar(10) NOT NULL,
	"category" varchar(100) NOT NULL,
	"description" text NOT NULL,
	"tax" numeric(12, 2) NOT NULL,
	CONSTRAINT "invoice_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "passkey" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "passkey_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" varchar(255),
	"public_key" text NOT NULL,
	"user_id" bigint NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean NOT NULL,
	"transports" text,
	"created_at" timestamp with time zone,
	"aaguid" text
);
--> statement-breakpoint
CREATE TABLE "plan" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"type" "plan_type" NOT NULL,
	"user_id" bigint NOT NULL,
	CONSTRAINT "plan_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"title" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"creator_id" bigint NOT NULL,
	CONSTRAINT "post_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "session_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" bigint NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "verification_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "widget" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "widget_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"nano_id" varchar(11) NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	"name" varchar(100) NOT NULL,
	"category" "widget_category" DEFAULT 'basic' NOT NULL,
	"amount" integer NOT NULL,
	CONSTRAINT "widget_nano_id_unique" UNIQUE("nano_id")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "address" ADD CONSTRAINT "address_credit_card_id_credit_card_id_fk" FOREIGN KEY ("credit_card_id") REFERENCES "public"."credit_card"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey" ADD CONSTRAINT "passkey_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan" ADD CONSTRAINT "plan_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_creator_id_user_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "address_nano_id_idx" ON "address" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "address_credit_card_id_idx" ON "address" USING btree ("credit_card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bug_nano_id_idx" ON "bug" USING btree ("nano_id");--> statement-breakpoint
CREATE UNIQUE INDEX "credit_card_nano_id_idx" ON "credit_card" USING btree ("nano_id");--> statement-breakpoint
CREATE UNIQUE INDEX "invoice_nano_id_idx" ON "invoice" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "passkey_userId_idx" ON "passkey" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "passkey_credentialID_idx" ON "passkey" USING btree ("credential_id");--> statement-breakpoint
CREATE UNIQUE INDEX "plan_nano_id_idx" ON "plan" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "plan_user_id_idx" ON "plan" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "post_creator_id_idx" ON "post" USING btree ("creator_id");--> statement-breakpoint
CREATE UNIQUE INDEX "post_nano_id_idx" ON "post" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");--> statement-breakpoint
CREATE UNIQUE INDEX "widget_nano_id_idx" ON "widget" USING btree ("nano_id");--> statement-breakpoint
CREATE INDEX "widget_category_idx" ON "widget" USING btree ("category");