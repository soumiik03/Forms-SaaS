CREATE TYPE "public"."form_field_type" AS ENUM('text', 'email', 'select', 'number', 'textarea', 'checkbox', 'radio', 'rating', 'date');--> statement-breakpoint
CREATE TYPE "public"."form_status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TYPE "public"."form_visibility" AS ENUM('public', 'unlisted');--> statement-breakpoint
CREATE TABLE "form_fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid,
	"type" "form_field_type",
	"label" varchar NOT NULL,
	"required" boolean DEFAULT false,
	"order" integer,
	"options" jsonb,
	"placeholder" text,
	"validation" jsonb,
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "form_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_id" uuid,
	"answers" jsonb DEFAULT '{}' NOT NULL,
	"respondent_email" varchar,
	"respondent_name" varchar,
	"submitted_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true
);
--> statement-breakpoint
CREATE TABLE "forms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"creator_id" uuid,
	"status" "form_status" DEFAULT 'draft',
	"visibility" "form_visibility" DEFAULT 'unlisted',
	"accent_color" varchar,
	"success_message" text,
	"created_at" timestamp DEFAULT now(),
	"deleted_at" timestamp,
	"updated_at" timestamp,
	"submission_count" integer DEFAULT 0,
	"view_count" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "forms_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"deleted_at" timestamp,
	"is_active" boolean DEFAULT true,
	CONSTRAINT "user_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "password_hash" text NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "plan" varchar(20) DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "form_fields" ADD CONSTRAINT "form_fields_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "form_responses" ADD CONSTRAINT "form_responses_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forms" ADD CONSTRAINT "forms_creator_id_users_id_fk" FOREIGN KEY ("creator_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;