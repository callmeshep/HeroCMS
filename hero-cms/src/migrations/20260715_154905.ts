import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_engineer_hub_website_update_log_entries_tag" AS ENUM('Fixed', 'Added');
  CREATE TYPE "public"."enum_yef_service_pages_service_type" AS ENUM('plumbing', 'heating', 'electrics');
  CREATE TABLE "engineer_hub_website_update_log_entries" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" "enum_engineer_hub_website_update_log_entries_tag" NOT NULL,
  	"title" varchar NOT NULL,
  	"date" timestamp(3) with time zone
  );
  
  CREATE TABLE "engineer_hub_website_surveys" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"survey_id" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "engineer_hub_website_tiers_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "engineer_hub_website_tiers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price" varchar,
  	"price_period" varchar,
  	"cta_button_text" varchar
  );
  
  CREATE TABLE "engineer_hub_website_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" varchar,
  	"avatar_colour" varchar,
  	"phone" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "engineer_hub_website_policies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"last_updated" timestamp(3) with time zone,
  	"content" jsonb
  );
  
  CREATE TABLE "engineer_hub_website" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"internal_title" varchar DEFAULT 'Engineer Hub Website',
  	"logo_id" integer,
  	"footer_strapline" varchar,
  	"footer_copyright_text" varchar,
  	"issue_active" boolean DEFAULT false,
  	"issue_pill_label" varchar,
  	"issue_title" varchar,
  	"issue_announced_at" timestamp(3) with time zone,
  	"issue_body" jsonb,
  	"kh_section_headline" varchar DEFAULT 'Knowledge Hub',
  	"app_section_headline" varchar DEFAULT 'The App',
  	"wishlist_headline" varchar DEFAULT 'App Wishlist',
  	"wishlist_body_text" varchar,
  	"update_log_headline" varchar DEFAULT 'App Update Log',
  	"update_log_body_text" varchar,
  	"forms_section_headline" varchar DEFAULT 'Forms & Surveys',
  	"report_problem_headline" varchar DEFAULT 'Report a Problem',
  	"report_problem_body_text" varchar,
  	"insurance_headline" varchar DEFAULT 'Insurance & docs',
  	"insurance_body_text" varchar,
  	"membership_section_headline" varchar DEFAULT 'Membership',
  	"contact_section_headline" varchar DEFAULT 'Get in touch',
  	"message_card_headline" varchar DEFAULT 'Leave a message',
  	"message_card_role_label" varchar DEFAULT 'General enquiries',
  	"message_card_cta_text" varchar DEFAULT 'Write a message',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "yef_website_home_promise_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "yef_website_home_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL
  );
  
  CREATE TABLE "yef_website_home_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "yef_service_pages_hero_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "yef_service_pages_whatever_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "yef_service_pages_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "yef_service_pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"fixed_stamp_id" integer,
  	"service_type" "enum_yef_service_pages_service_type" NOT NULL,
  	"primary_colour" varchar NOT NULL,
  	"secondary_colour" varchar NOT NULL,
  	"meta_description" varchar,
  	"hero_headline_line1" varchar,
  	"hero_headline_line2" varchar,
  	"hero_engineer_image_id" integer,
  	"hero_engineer_label" varchar,
  	"hero_engineer_arrow_id" integer,
  	"hero_cta_text" varchar,
  	"whatever_headline_line1" varchar,
  	"whatever_headline_line2" varchar,
  	"whatever_body" varchar,
  	"whatever_image_id" integer,
  	"faq_headline_line1" varchar,
  	"faq_headline_line2" varchar,
  	"faq_body" varchar,
  	"faq_cta_text" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "yef_blog_posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"published_date" timestamp(3) with time zone NOT NULL,
  	"body_content" jsonb NOT NULL,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "yef_website_home_whatever_services" ADD COLUMN "url" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "fixed_stamp_id" integer;
  ALTER TABLE "yef_website" ADD COLUMN "home_cta_banner_headline" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_cta_banner_cta_text" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_cta_banner_image_id" integer;
  ALTER TABLE "yef_website" ADD COLUMN "home_cta_banner_image_mobile_id" integer;
  ALTER TABLE "yef_website" ADD COLUMN "home_promise_headline_line1" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_promise_headline_line2" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_how_it_works_headline_line1" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_how_it_works_headline_line2" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_faq_headline_line1" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_faq_headline_line2" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_faq_body" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_faq_cta_text" varchar;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "engineer_hub_website_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_service_pages_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "yef_blog_posts_id" integer;
  ALTER TABLE "engineer_hub_website_update_log_entries" ADD CONSTRAINT "engineer_hub_website_update_log_entries_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website_surveys" ADD CONSTRAINT "engineer_hub_website_surveys_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website_tiers_features" ADD CONSTRAINT "engineer_hub_website_tiers_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website_tiers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website_tiers" ADD CONSTRAINT "engineer_hub_website_tiers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website_contacts" ADD CONSTRAINT "engineer_hub_website_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website_policies" ADD CONSTRAINT "engineer_hub_website_policies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "engineer_hub_website" ADD CONSTRAINT "engineer_hub_website_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "engineer_hub_website" ADD CONSTRAINT "engineer_hub_website_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website_home_promise_cards" ADD CONSTRAINT "yef_website_home_promise_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website_home_promise_cards" ADD CONSTRAINT "yef_website_home_promise_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_website_home_how_it_works_steps" ADD CONSTRAINT "yef_website_home_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website_home_how_it_works_steps" ADD CONSTRAINT "yef_website_home_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_website_home_faq_items" ADD CONSTRAINT "yef_website_home_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_service_pages_hero_bullets" ADD CONSTRAINT "yef_service_pages_hero_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_service_pages_whatever_services" ADD CONSTRAINT "yef_service_pages_whatever_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_service_pages_whatever_services" ADD CONSTRAINT "yef_service_pages_whatever_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_service_pages_faq_items" ADD CONSTRAINT "yef_service_pages_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "yef_service_pages" ADD CONSTRAINT "yef_service_pages_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_service_pages" ADD CONSTRAINT "yef_service_pages_fixed_stamp_id_media_id_fk" FOREIGN KEY ("fixed_stamp_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_service_pages" ADD CONSTRAINT "yef_service_pages_hero_engineer_image_id_media_id_fk" FOREIGN KEY ("hero_engineer_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_service_pages" ADD CONSTRAINT "yef_service_pages_hero_engineer_arrow_id_media_id_fk" FOREIGN KEY ("hero_engineer_arrow_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_service_pages" ADD CONSTRAINT "yef_service_pages_whatever_image_id_media_id_fk" FOREIGN KEY ("whatever_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_blog_posts" ADD CONSTRAINT "yef_blog_posts_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "engineer_hub_website_update_log_entries_order_idx" ON "engineer_hub_website_update_log_entries" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_update_log_entries_parent_id_idx" ON "engineer_hub_website_update_log_entries" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_surveys_order_idx" ON "engineer_hub_website_surveys" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_surveys_parent_id_idx" ON "engineer_hub_website_surveys" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_tiers_features_order_idx" ON "engineer_hub_website_tiers_features" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_tiers_features_parent_id_idx" ON "engineer_hub_website_tiers_features" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_tiers_order_idx" ON "engineer_hub_website_tiers" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_tiers_parent_id_idx" ON "engineer_hub_website_tiers" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_contacts_order_idx" ON "engineer_hub_website_contacts" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_contacts_parent_id_idx" ON "engineer_hub_website_contacts" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_policies_order_idx" ON "engineer_hub_website_policies" USING btree ("_order");
  CREATE INDEX "engineer_hub_website_policies_parent_id_idx" ON "engineer_hub_website_policies" USING btree ("_parent_id");
  CREATE INDEX "engineer_hub_website_tenant_idx" ON "engineer_hub_website" USING btree ("tenant_id");
  CREATE INDEX "engineer_hub_website_logo_idx" ON "engineer_hub_website" USING btree ("logo_id");
  CREATE INDEX "engineer_hub_website_updated_at_idx" ON "engineer_hub_website" USING btree ("updated_at");
  CREATE INDEX "engineer_hub_website_created_at_idx" ON "engineer_hub_website" USING btree ("created_at");
  CREATE INDEX "yef_website_home_promise_cards_order_idx" ON "yef_website_home_promise_cards" USING btree ("_order");
  CREATE INDEX "yef_website_home_promise_cards_parent_id_idx" ON "yef_website_home_promise_cards" USING btree ("_parent_id");
  CREATE INDEX "yef_website_home_promise_cards_icon_idx" ON "yef_website_home_promise_cards" USING btree ("icon_id");
  CREATE INDEX "yef_website_home_how_it_works_steps_order_idx" ON "yef_website_home_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "yef_website_home_how_it_works_steps_parent_id_idx" ON "yef_website_home_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "yef_website_home_how_it_works_steps_image_idx" ON "yef_website_home_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "yef_website_home_faq_items_order_idx" ON "yef_website_home_faq_items" USING btree ("_order");
  CREATE INDEX "yef_website_home_faq_items_parent_id_idx" ON "yef_website_home_faq_items" USING btree ("_parent_id");
  CREATE INDEX "yef_service_pages_hero_bullets_order_idx" ON "yef_service_pages_hero_bullets" USING btree ("_order");
  CREATE INDEX "yef_service_pages_hero_bullets_parent_id_idx" ON "yef_service_pages_hero_bullets" USING btree ("_parent_id");
  CREATE INDEX "yef_service_pages_whatever_services_order_idx" ON "yef_service_pages_whatever_services" USING btree ("_order");
  CREATE INDEX "yef_service_pages_whatever_services_parent_id_idx" ON "yef_service_pages_whatever_services" USING btree ("_parent_id");
  CREATE INDEX "yef_service_pages_whatever_services_icon_idx" ON "yef_service_pages_whatever_services" USING btree ("icon_id");
  CREATE INDEX "yef_service_pages_faq_items_order_idx" ON "yef_service_pages_faq_items" USING btree ("_order");
  CREATE INDEX "yef_service_pages_faq_items_parent_id_idx" ON "yef_service_pages_faq_items" USING btree ("_parent_id");
  CREATE INDEX "yef_service_pages_tenant_idx" ON "yef_service_pages" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "yef_service_pages_slug_idx" ON "yef_service_pages" USING btree ("slug");
  CREATE INDEX "yef_service_pages_fixed_stamp_idx" ON "yef_service_pages" USING btree ("fixed_stamp_id");
  CREATE INDEX "yef_service_pages_hero_engineer_image_idx" ON "yef_service_pages" USING btree ("hero_engineer_image_id");
  CREATE INDEX "yef_service_pages_hero_engineer_arrow_idx" ON "yef_service_pages" USING btree ("hero_engineer_arrow_id");
  CREATE INDEX "yef_service_pages_whatever_image_idx" ON "yef_service_pages" USING btree ("whatever_image_id");
  CREATE INDEX "yef_service_pages_updated_at_idx" ON "yef_service_pages" USING btree ("updated_at");
  CREATE INDEX "yef_service_pages_created_at_idx" ON "yef_service_pages" USING btree ("created_at");
  CREATE INDEX "yef_blog_posts_tenant_idx" ON "yef_blog_posts" USING btree ("tenant_id");
  CREATE UNIQUE INDEX "yef_blog_posts_slug_idx" ON "yef_blog_posts" USING btree ("slug");
  CREATE INDEX "yef_blog_posts_updated_at_idx" ON "yef_blog_posts" USING btree ("updated_at");
  CREATE INDEX "yef_blog_posts_created_at_idx" ON "yef_blog_posts" USING btree ("created_at");
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_fixed_stamp_id_media_id_fk" FOREIGN KEY ("fixed_stamp_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_home_cta_banner_image_id_media_id_fk" FOREIGN KEY ("home_cta_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_home_cta_banner_image_mobile_id_media_id_fk" FOREIGN KEY ("home_cta_banner_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_engineer_hub_website_fk" FOREIGN KEY ("engineer_hub_website_id") REFERENCES "public"."engineer_hub_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_service_pages_fk" FOREIGN KEY ("yef_service_pages_id") REFERENCES "public"."yef_service_pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_yef_blog_posts_fk" FOREIGN KEY ("yef_blog_posts_id") REFERENCES "public"."yef_blog_posts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "yef_website_fixed_stamp_idx" ON "yef_website" USING btree ("fixed_stamp_id");
  CREATE INDEX "yef_website_home_cta_banner_image_idx" ON "yef_website" USING btree ("home_cta_banner_image_id");
  CREATE INDEX "yef_website_home_cta_banner_image_mobile_idx" ON "yef_website" USING btree ("home_cta_banner_image_mobile_id");
  CREATE INDEX "payload_locked_documents_rels_engineer_hub_website_id_idx" ON "payload_locked_documents_rels" USING btree ("engineer_hub_website_id");
  CREATE INDEX "payload_locked_documents_rels_yef_service_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_service_pages_id");
  CREATE INDEX "payload_locked_documents_rels_yef_blog_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("yef_blog_posts_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "engineer_hub_website_update_log_entries" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website_surveys" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website_tiers_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website_tiers" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website_policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "engineer_hub_website" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_website_home_promise_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_website_home_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_website_home_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_service_pages_hero_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_service_pages_whatever_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_service_pages_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_service_pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "yef_blog_posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "engineer_hub_website_update_log_entries" CASCADE;
  DROP TABLE "engineer_hub_website_surveys" CASCADE;
  DROP TABLE "engineer_hub_website_tiers_features" CASCADE;
  DROP TABLE "engineer_hub_website_tiers" CASCADE;
  DROP TABLE "engineer_hub_website_contacts" CASCADE;
  DROP TABLE "engineer_hub_website_policies" CASCADE;
  DROP TABLE "engineer_hub_website" CASCADE;
  DROP TABLE "yef_website_home_promise_cards" CASCADE;
  DROP TABLE "yef_website_home_how_it_works_steps" CASCADE;
  DROP TABLE "yef_website_home_faq_items" CASCADE;
  DROP TABLE "yef_service_pages_hero_bullets" CASCADE;
  DROP TABLE "yef_service_pages_whatever_services" CASCADE;
  DROP TABLE "yef_service_pages_faq_items" CASCADE;
  DROP TABLE "yef_service_pages" CASCADE;
  DROP TABLE "yef_blog_posts" CASCADE;
  ALTER TABLE "yef_website" DROP CONSTRAINT "yef_website_fixed_stamp_id_media_id_fk";
  
  ALTER TABLE "yef_website" DROP CONSTRAINT "yef_website_home_cta_banner_image_id_media_id_fk";
  
  ALTER TABLE "yef_website" DROP CONSTRAINT "yef_website_home_cta_banner_image_mobile_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_engineer_hub_website_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_service_pages_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_yef_blog_posts_fk";
  
  DROP INDEX "yef_website_fixed_stamp_idx";
  DROP INDEX "yef_website_home_cta_banner_image_idx";
  DROP INDEX "yef_website_home_cta_banner_image_mobile_idx";
  DROP INDEX "payload_locked_documents_rels_engineer_hub_website_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_service_pages_id_idx";
  DROP INDEX "payload_locked_documents_rels_yef_blog_posts_id_idx";
  ALTER TABLE "yef_website_home_whatever_services" DROP COLUMN "url";
  ALTER TABLE "yef_website" DROP COLUMN "fixed_stamp_id";
  ALTER TABLE "yef_website" DROP COLUMN "home_cta_banner_headline";
  ALTER TABLE "yef_website" DROP COLUMN "home_cta_banner_cta_text";
  ALTER TABLE "yef_website" DROP COLUMN "home_cta_banner_image_id";
  ALTER TABLE "yef_website" DROP COLUMN "home_cta_banner_image_mobile_id";
  ALTER TABLE "yef_website" DROP COLUMN "home_promise_headline_line1";
  ALTER TABLE "yef_website" DROP COLUMN "home_promise_headline_line2";
  ALTER TABLE "yef_website" DROP COLUMN "home_how_it_works_headline_line1";
  ALTER TABLE "yef_website" DROP COLUMN "home_how_it_works_headline_line2";
  ALTER TABLE "yef_website" DROP COLUMN "home_faq_headline_line1";
  ALTER TABLE "yef_website" DROP COLUMN "home_faq_headline_line2";
  ALTER TABLE "yef_website" DROP COLUMN "home_faq_body";
  ALTER TABLE "yef_website" DROP COLUMN "home_faq_cta_text";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "engineer_hub_website_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_service_pages_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "yef_blog_posts_id";
  DROP TYPE "public"."enum_engineer_hub_website_update_log_entries_tag";
  DROP TYPE "public"."enum_yef_service_pages_service_type";`)
}
