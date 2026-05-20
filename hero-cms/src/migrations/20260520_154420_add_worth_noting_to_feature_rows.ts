import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "all_form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "herocare_website_thank_you_plan_cards" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "all_form_submissions" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "herocare_website_thank_you_plan_cards" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_all_form_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_all_form_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "herocare_website_feature_rows" ADD COLUMN "worth_noting" varchar;
  ALTER TABLE "herocare_website_included_cards" DROP COLUMN "cta_link";
  ALTER TABLE "herocare_website_landlord_included_cards" DROP COLUMN "cta_link";
  ALTER TABLE "herocare_website_feature_rows" DROP COLUMN "included_in_plan3";
  ALTER TABLE "herocare_website" DROP COLUMN "why_us_cta_link";
  ALTER TABLE "herocare_website" DROP COLUMN "cta_button_link";
  ALTER TABLE "herocare_website" DROP COLUMN "popup_subheading";
  ALTER TABLE "herocare_website" DROP COLUMN "popup_thank_you_message";
  ALTER TABLE "herocare_website" DROP COLUMN "thank_you_headline_line1";
  ALTER TABLE "herocare_website" DROP COLUMN "thank_you_headline_line2";
  ALTER TABLE "herocare_website" DROP COLUMN "thank_you_plan_headline_line1";
  ALTER TABLE "herocare_website" DROP COLUMN "thank_you_plan_headline_line2";
  ALTER TABLE "herocare_website" DROP COLUMN "thank_you_see_everything_text";
  ALTER TABLE "herocare_website" DROP COLUMN "landlord_why_us_cta_link";
  ALTER TABLE "herocare_website" DROP COLUMN "landlord_cta_button_link";
  ALTER TABLE "herocare_website" DROP COLUMN "landlord_popup_subheading";
  ALTER TABLE "herocare_website" DROP COLUMN "landlord_popup_thank_you_message";
  ALTER TABLE "herocare_website" DROP COLUMN "pricing_hero_headline_line1";
  ALTER TABLE "herocare_website" DROP COLUMN "pricing_hero_headline_line2";
  ALTER TABLE "herocare_website" DROP COLUMN "pricing_hero_subheading";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "all_form_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "form_submissions_id";
  DROP TYPE "public"."enum_all_form_submissions_journey";
  DROP TYPE "public"."enum_all_form_submissions_webhook_status";
  DROP TYPE "public"."enum_form_submissions_journey";
  DROP TYPE "public"."enum_form_submissions_webhook_status";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_all_form_submissions_journey" AS ENUM('homeowner', 'landlord');
  CREATE TYPE "public"."enum_all_form_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_form_submissions_journey" AS ENUM('homeowner', 'landlord');
  CREATE TYPE "public"."enum_form_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TABLE "all_form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer,
  	"journey" "enum_all_form_submissions_journey",
  	"name" varchar,
  	"postcode" varchar,
  	"company_name" varchar,
  	"number_of_properties" numeric,
  	"phone_number" varchar,
  	"submitted_at" timestamp(3) with time zone,
  	"webhook_status" "enum_all_form_submissions_webhook_status",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"journey" "enum_form_submissions_journey" NOT NULL,
  	"name" varchar NOT NULL,
  	"postcode" varchar,
  	"company_name" varchar,
  	"number_of_properties" numeric,
  	"phone_number" varchar NOT NULL,
  	"submitted_at" timestamp(3) with time zone,
  	"webhook_status" "enum_form_submissions_webhook_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "herocare_website_thank_you_plan_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar
  );
  
  ALTER TABLE "herocare_website_included_cards" ADD COLUMN "cta_link" varchar;
  ALTER TABLE "herocare_website_landlord_included_cards" ADD COLUMN "cta_link" varchar;
  ALTER TABLE "herocare_website_feature_rows" ADD COLUMN "included_in_plan3" boolean;
  ALTER TABLE "herocare_website" ADD COLUMN "why_us_cta_link" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "cta_button_link" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "popup_subheading" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "popup_thank_you_message" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "thank_you_headline_line1" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "thank_you_headline_line2" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "thank_you_plan_headline_line1" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "thank_you_plan_headline_line2" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "thank_you_see_everything_text" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "landlord_why_us_cta_link" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "landlord_cta_button_link" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "landlord_popup_subheading" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "landlord_popup_thank_you_message" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "pricing_hero_headline_line1" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "pricing_hero_headline_line2" varchar;
  ALTER TABLE "herocare_website" ADD COLUMN "pricing_hero_subheading" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "all_form_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "all_form_submissions" ADD CONSTRAINT "all_form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_thank_you_plan_cards" ADD CONSTRAINT "herocare_website_thank_you_plan_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_thank_you_plan_cards" ADD CONSTRAINT "herocare_website_thank_you_plan_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "all_form_submissions_tenant_idx" ON "all_form_submissions" USING btree ("tenant_id");
  CREATE INDEX "all_form_submissions_updated_at_idx" ON "all_form_submissions" USING btree ("updated_at");
  CREATE INDEX "all_form_submissions_created_at_idx" ON "all_form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "herocare_website_thank_you_plan_cards_order_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_thank_you_plan_cards_parent_id_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_thank_you_plan_cards_icon_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("icon_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_all_form_submissions_fk" FOREIGN KEY ("all_form_submissions_id") REFERENCES "public"."all_form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_all_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("all_form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  ALTER TABLE "herocare_website_feature_rows" DROP COLUMN "worth_noting";`)
}
