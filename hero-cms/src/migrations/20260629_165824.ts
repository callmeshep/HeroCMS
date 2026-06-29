import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_yef_email_templates_name" AS ENUM('admin-notification', 'customer-notification');
  CREATE TYPE "public"."enum_yef_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TABLE "yef_brand_assets" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "yef_email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" "enum_yef_email_templates_name" NOT NULL,
  	"subject_line" varchar NOT NULL,
  	"logo_id" integer,
  	"heading" varchar NOT NULL,
  	"body_text" varchar NOT NULL,
  	"button_text" varchar,
  	"button_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "yef_image_gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"tenant_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "yef_forms_notification_recipients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL
  );
  
  CREATE TABLE "yef_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"page" varchar NOT NULL,
  	"notifications_enabled" boolean DEFAULT true,
  	"views" numeric DEFAULT 0,
  	"attempts" numeric DEFAULT 0,
  	"completions" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "yef_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"form_id" varchar,
  	"name" varchar,
  	"phone_number" varchar,
  	"postcode" varchar,
  	"service" varchar,
  	"email" varchar,
  	"submitted_at" timestamp(3) with time zone,
  	"webhook_status" "enum_yef_submissions_webhook_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "yef_website_policies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "yef_website" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar DEFAULT 'Your Emergency Fixed Website',
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"phone_number" varchar,
  	"reviews_rating" numeric,
  	"reviews_count" numeric,
  	"reviews_platforms_label" varchar,
  	"hero_background_image_id" integer,
  	"home_hero_headline" varchar,
  	"home_hero_subheading" varchar,
  	"home_hero_cta_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_brand_assets_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_email_templates_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_image_gallery_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_website_id" integer;
  ALTER TABLE "yef_brand_assets" ADD CONSTRAINT "yef_brand_assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_email_templates" ADD CONSTRAINT "yef_email_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_email_templates" ADD CONSTRAINT "yef_email_templates_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_image_gallery" ADD CONSTRAINT "yef_image_gallery_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_forms_notification_recipients" ADD CONSTRAINT "yef_forms_notification_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_forms" ADD CONSTRAINT "yef_forms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_submissions" ADD CONSTRAINT "yef_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website_policies" ADD CONSTRAINT "yef_website_policies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "yef_brand_assets_tenant_idx" ON "yef_brand_assets" USING btree ("tenant_id");
  CREATE INDEX "yef_brand_assets_updated_at_idx" ON "yef_brand_assets" USING btree ("updated_at");
  CREATE INDEX "yef_brand_assets_created_at_idx" ON "yef_brand_assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "yef_brand_assets_filename_idx" ON "yef_brand_assets" USING btree ("filename");
  CREATE INDEX "yef_email_templates_tenant_idx" ON "yef_email_templates" USING btree ("tenant_id");
  CREATE INDEX "yef_email_templates_logo_idx" ON "yef_email_templates" USING btree ("logo_id");
  CREATE INDEX "yef_email_templates_updated_at_idx" ON "yef_email_templates" USING btree ("updated_at");
  CREATE INDEX "yef_email_templates_created_at_idx" ON "yef_email_templates" USING btree ("created_at");
  CREATE INDEX "yef_image_gallery_tenant_idx" ON "yef_image_gallery" USING btree ("tenant_id");
  CREATE INDEX "yef_image_gallery_updated_at_idx" ON "yef_image_gallery" USING btree ("updated_at");
  CREATE INDEX "yef_image_gallery_created_at_idx" ON "yef_image_gallery" USING btree ("created_at");
  CREATE UNIQUE INDEX "yef_image_gallery_filename_idx" ON "yef_image_gallery" USING btree ("filename");
  CREATE INDEX "yef_forms_notification_recipients_order_idx" ON "yef_forms_notification_recipients" USING btree ("_order");
  CREATE INDEX "yef_forms_notification_recipients_parent_id_idx" ON "yef_forms_notification_recipients" USING btree ("_parent_id");
  CREATE INDEX "yef_forms_tenant_idx" ON "yef_forms" USING btree ("tenant_id");
  CREATE INDEX "yef_forms_updated_at_idx" ON "yef_forms" USING btree ("updated_at");
  CREATE INDEX "yef_forms_created_at_idx" ON "yef_forms" USING btree ("created_at");
  CREATE INDEX "yef_submissions_tenant_idx" ON "yef_submissions" USING btree ("tenant_id");
  CREATE INDEX "yef_submissions_updated_at_idx" ON "yef_submissions" USING btree ("updated_at");
  CREATE INDEX "yef_submissions_created_at_idx" ON "yef_submissions" USING btree ("created_at");
  CREATE INDEX "yef_website_policies_order_idx" ON "yef_website_policies" USING btree ("_order");
  CREATE INDEX "yef_website_policies_parent_id_idx" ON "yef_website_policies" USING btree ("_parent_id");
  CREATE INDEX "yef_website_tenant_idx" ON "yef_website" USING btree ("tenant_id");
  CREATE INDEX "yef_website_logo_idx" ON "yef_website" USING btree ("logo_id");
  CREATE INDEX "yef_website_logo_dark_idx" ON "yef_website" USING btree ("logo_dark_id");
  CREATE INDEX "yef_website_favicon_idx" ON "yef_website" USING btree ("favicon_id");
  CREATE INDEX "yef_website_hero_background_image_idx" ON "yef_website" USING btree ("hero_background_image_id");
  CREATE INDEX "yef_website_updated_at_idx" ON "yef_website" USING btree ("updated_at");
  CREATE INDEX "yef_website_created_at_idx" ON "yef_website" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_brand_assets_fk" FOREIGN KEY ("yef_brand_assets_id") REFERENCES "public"."yef_brand_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_email_templates_fk" FOREIGN KEY ("yef_email_templates_id") REFERENCES "public"."yef_email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_image_gallery_fk" FOREIGN KEY ("yef_image_gallery_id") REFERENCES "public"."yef_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_forms_fk" FOREIGN KEY ("yef_forms_id") REFERENCES "public"."yef_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_submissions_fk" FOREIGN KEY ("yef_submissions_id") REFERENCES "public"."yef_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_website_fk" FOREIGN KEY ("yef_website_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_yef_brand_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_brand_assets_id");
  CREATE INDEX "payload_locked_documents_rels_yef_email_templates_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_yef_image_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_image_gallery_id");
  CREATE INDEX "payload_locked_documents_rels_yef_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_forms_id");
  CREATE INDEX "payload_locked_documents_rels_yef_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_yef_website_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_website_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_brand_assets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_forms_notification_recipients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_website_policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_website" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "yef_brand_assets" CASCADE;
  DROP TABLE "yef_email_templates" CASCADE;
  DROP TABLE "yef_image_gallery" CASCADE;
  DROP TABLE "yef_forms_notification_recipients" CASCADE;
  DROP TABLE "yef_forms" CASCADE;
  DROP TABLE "yef_submissions" CASCADE;
  DROP TABLE "yef_website_policies" CASCADE;
  DROP TABLE "yef_website" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_brand_assets_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_email_templates_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_image_gallery_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_website_fk";
  
  DROP INDEX "payload_locked_documents_rels_yef_brand_assets_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_email_templates_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_image_gallery_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_website_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_brand_assets_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_email_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_image_gallery_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_website_id";
  DROP TYPE "public"."enum_yef_email_templates_name";
  DROP TYPE "public"."enum_yef_submissions_webhook_status";`)
}
