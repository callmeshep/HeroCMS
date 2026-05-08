import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'admin');
  CREATE TYPE "public"."enum_all_form_submissions_journey" AS ENUM('homeowner', 'landlord');
  CREATE TYPE "public"."enum_all_form_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_form_submissions_journey" AS ENUM('homeowner', 'landlord');
  CREATE TYPE "public"."enum_form_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_herocare_email_templates_name" AS ENUM('admin-notification', 'customer-notification');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "users_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"tenants_id" integer
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  
  CREATE TABLE "tenants" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "api_keys" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"cloudflare_deploy_hook" varchar,
  	"resend_from_name" varchar,
  	"resend_from_email" varchar,
  	"crm_webhook_u_r_l" varchar,
  	"crm_a_p_i_key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
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
  
  CREATE TABLE "herocare_website_hero_bullet_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "herocare_website_included_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar
  );
  
  CREATE TABLE "herocare_website_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "herocare_website_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "herocare_website_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
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
  
  CREATE TABLE "herocare_website_landlord_hero_bullet_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "herocare_website_landlord_included_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar,
  	"cta_link" varchar
  );
  
  CREATE TABLE "herocare_website_landlord_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "herocare_website_landlord_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "herocare_website_landlord_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" varchar NOT NULL
  );
  
  CREATE TABLE "herocare_website_callout_fee_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "herocare_website_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"price_high_callout" varchar,
  	"price_low_callout" varchar,
  	"price_period" varchar,
  	"cta_text" varchar,
  	"stripe_link" varchar,
  	"highlight_colour" varchar
  );
  
  CREATE TABLE "herocare_website_feature_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"feature_name" varchar NOT NULL,
  	"included_in_plan1" boolean,
  	"included_in_plan2" boolean,
  	"included_in_plan3" boolean
  );
  
  CREATE TABLE "herocare_website_about_your_plan_accordion" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "herocare_website_policies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "herocare_website" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar DEFAULT 'HeroCare Website',
  	"logo_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"phone_number" varchar,
  	"nav_cta_text" varchar,
  	"nav_cta_link" varchar,
  	"top_bar_homeowners_label" varchar,
  	"top_bar_homeowners_u_r_l" varchar,
  	"top_bar_landlords_label" varchar,
  	"top_bar_landlords_u_r_l" varchar,
  	"emergency_hero_logo_id" integer,
  	"emergency_hero_link" varchar,
  	"trustpilot_rating" numeric,
  	"trustpilot_review_count" numeric,
  	"trustpilot_link" varchar,
  	"hero_headline_line1" varchar,
  	"hero_headline_line2" varchar,
  	"hero_form_subheading" varchar,
  	"hero_form_cta_text" varchar,
  	"hero_image_id" integer,
  	"included_headline_line1" varchar,
  	"included_headline_line2" varchar,
  	"included_subheading" varchar,
  	"how_it_works_headline" varchar,
  	"why_us_headline_line1" varchar,
  	"why_us_headline_line2" varchar,
  	"why_us_subheading" varchar,
  	"why_us_cta_text" varchar,
  	"why_us_cta_link" varchar,
  	"faqs_headline_line1" varchar,
  	"faqs_headline_line2" varchar,
  	"faqs_subheading" varchar,
  	"cta_headline_line1" varchar,
  	"cta_headline_line2" varchar,
  	"cta_subheading" varchar,
  	"cta_button_text" varchar,
  	"cta_button_link" varchar,
  	"cta_image_id" integer,
  	"popup_headline" varchar,
  	"popup_subheading" varchar,
  	"popup_image_id" integer,
  	"popup_cta_text" varchar,
  	"popup_thank_you_message" varchar,
  	"thank_you_headline_line1" varchar,
  	"thank_you_headline_line2" varchar,
  	"thank_you_plan_headline_line1" varchar,
  	"thank_you_plan_headline_line2" varchar,
  	"thank_you_see_everything_text" varchar,
  	"landlord_hero_headline_line1" varchar,
  	"landlord_hero_headline_line2" varchar,
  	"landlord_hero_cta_text" varchar,
  	"landlord_hero_image_id" integer,
  	"landlord_included_headline_line1" varchar,
  	"landlord_included_headline_line2" varchar,
  	"landlord_included_subheading" varchar,
  	"landlord_how_it_works_headline" varchar,
  	"landlord_why_us_headline_line1" varchar,
  	"landlord_why_us_headline_line2" varchar,
  	"landlord_why_us_subheading" varchar,
  	"landlord_why_us_cta_text" varchar,
  	"landlord_why_us_cta_link" varchar,
  	"landlord_faqs_headline_line1" varchar,
  	"landlord_faqs_headline_line2" varchar,
  	"landlord_faqs_subheading" varchar,
  	"landlord_cta_headline_line1" varchar,
  	"landlord_cta_headline_line2" varchar,
  	"landlord_cta_subheading" varchar,
  	"landlord_cta_button_text" varchar,
  	"landlord_cta_button_link" varchar,
  	"landlord_cta_image_id" integer,
  	"landlord_popup_headline" varchar,
  	"landlord_popup_subheading" varchar,
  	"landlord_popup_image_id" integer,
  	"landlord_popup_cta_text" varchar,
  	"landlord_popup_thank_you_message" varchar,
  	"pricing_hero_headline_line1" varchar,
  	"pricing_hero_headline_line2" varchar,
  	"pricing_hero_subheading" varchar,
  	"callout_fee_label" varchar,
  	"callout_fee_description" varchar,
  	"about_your_plan_cta_headline_line1" varchar,
  	"about_your_plan_cta_headline_line2" varchar,
  	"about_your_plan_cta_phone" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "herocare_image_gallery" (
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
  
  CREATE TABLE "herocare_brand_assets" (
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
  
  CREATE TABLE "herocare_email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" "enum_herocare_email_templates_name" NOT NULL,
  	"subject_line" varchar NOT NULL,
  	"logo_id" integer,
  	"heading" varchar NOT NULL,
  	"body_text" varchar NOT NULL,
  	"button_text" varchar,
  	"button_u_r_l" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_brand_assets" (
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
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"tenants_id" integer,
  	"api_keys_id" integer,
  	"all_form_submissions_id" integer,
  	"form_submissions_id" integer,
  	"herocare_website_id" integer,
  	"herocare_image_gallery_id" integer,
  	"herocare_brand_assets_id" integer,
  	"herocare_email_templates_id" integer,
  	"emergency_hero_brand_assets_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_rels" ADD CONSTRAINT "users_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "all_form_submissions" ADD CONSTRAINT "all_form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_hero_bullet_points" ADD CONSTRAINT "herocare_website_hero_bullet_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_included_cards" ADD CONSTRAINT "herocare_website_included_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_included_cards" ADD CONSTRAINT "herocare_website_included_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_how_it_works_steps" ADD CONSTRAINT "herocare_website_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_how_it_works_steps" ADD CONSTRAINT "herocare_website_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_why_us_cards" ADD CONSTRAINT "herocare_website_why_us_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_why_us_cards" ADD CONSTRAINT "herocare_website_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_faq_items" ADD CONSTRAINT "herocare_website_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_thank_you_plan_cards" ADD CONSTRAINT "herocare_website_thank_you_plan_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_thank_you_plan_cards" ADD CONSTRAINT "herocare_website_thank_you_plan_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_hero_bullet_points" ADD CONSTRAINT "herocare_website_landlord_hero_bullet_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_included_cards" ADD CONSTRAINT "herocare_website_landlord_included_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_included_cards" ADD CONSTRAINT "herocare_website_landlord_included_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_how_it_works_steps" ADD CONSTRAINT "herocare_website_landlord_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_how_it_works_steps" ADD CONSTRAINT "herocare_website_landlord_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_why_us_cards" ADD CONSTRAINT "herocare_website_landlord_why_us_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_why_us_cards" ADD CONSTRAINT "herocare_website_landlord_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_landlord_faq_items" ADD CONSTRAINT "herocare_website_landlord_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_callout_fee_options" ADD CONSTRAINT "herocare_website_callout_fee_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_plans" ADD CONSTRAINT "herocare_website_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_feature_rows" ADD CONSTRAINT "herocare_website_feature_rows_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_feature_rows" ADD CONSTRAINT "herocare_website_feature_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_about_your_plan_accordion" ADD CONSTRAINT "herocare_website_about_your_plan_accordion_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website_about_your_plan_accordion" ADD CONSTRAINT "herocare_website_about_your_plan_accordion_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website_policies" ADD CONSTRAINT "herocare_website_policies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_emergency_hero_logo_id_media_id_fk" FOREIGN KEY ("emergency_hero_logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_cta_image_id_media_id_fk" FOREIGN KEY ("cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_popup_image_id_media_id_fk" FOREIGN KEY ("popup_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_landlord_hero_image_id_media_id_fk" FOREIGN KEY ("landlord_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_landlord_cta_image_id_media_id_fk" FOREIGN KEY ("landlord_cta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_website" ADD CONSTRAINT "herocare_website_landlord_popup_image_id_media_id_fk" FOREIGN KEY ("landlord_popup_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_image_gallery" ADD CONSTRAINT "herocare_image_gallery_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_brand_assets" ADD CONSTRAINT "herocare_brand_assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_email_templates" ADD CONSTRAINT "herocare_email_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_email_templates" ADD CONSTRAINT "herocare_email_templates_logo_id_herocare_brand_assets_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."herocare_brand_assets"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_brand_assets" ADD CONSTRAINT "emergency_hero_brand_assets_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_tenants_fk" FOREIGN KEY ("tenants_id") REFERENCES "public"."tenants"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_api_keys_fk" FOREIGN KEY ("api_keys_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_all_form_submissions_fk" FOREIGN KEY ("all_form_submissions_id") REFERENCES "public"."all_form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_website_fk" FOREIGN KEY ("herocare_website_id") REFERENCES "public"."herocare_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_image_gallery_fk" FOREIGN KEY ("herocare_image_gallery_id") REFERENCES "public"."herocare_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_brand_assets_fk" FOREIGN KEY ("herocare_brand_assets_id") REFERENCES "public"."herocare_brand_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_email_templates_fk" FOREIGN KEY ("herocare_email_templates_id") REFERENCES "public"."herocare_email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_brand_assets_fk" FOREIGN KEY ("emergency_hero_brand_assets_id") REFERENCES "public"."emergency_hero_brand_assets"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "users_rels_order_idx" ON "users_rels" USING btree ("order");
  CREATE INDEX "users_rels_parent_idx" ON "users_rels" USING btree ("parent_id");
  CREATE INDEX "users_rels_path_idx" ON "users_rels" USING btree ("path");
  CREATE INDEX "users_rels_tenants_id_idx" ON "users_rels" USING btree ("tenants_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "tenants_slug_idx" ON "tenants" USING btree ("slug");
  CREATE INDEX "tenants_updated_at_idx" ON "tenants" USING btree ("updated_at");
  CREATE INDEX "tenants_created_at_idx" ON "tenants" USING btree ("created_at");
  CREATE UNIQUE INDEX "api_keys_tenant_idx" ON "api_keys" USING btree ("tenant_id");
  CREATE INDEX "api_keys_updated_at_idx" ON "api_keys" USING btree ("updated_at");
  CREATE INDEX "api_keys_created_at_idx" ON "api_keys" USING btree ("created_at");
  CREATE INDEX "all_form_submissions_tenant_idx" ON "all_form_submissions" USING btree ("tenant_id");
  CREATE INDEX "all_form_submissions_updated_at_idx" ON "all_form_submissions" USING btree ("updated_at");
  CREATE INDEX "all_form_submissions_created_at_idx" ON "all_form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE INDEX "herocare_website_hero_bullet_points_order_idx" ON "herocare_website_hero_bullet_points" USING btree ("_order");
  CREATE INDEX "herocare_website_hero_bullet_points_parent_id_idx" ON "herocare_website_hero_bullet_points" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_included_cards_order_idx" ON "herocare_website_included_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_included_cards_parent_id_idx" ON "herocare_website_included_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_included_cards_icon_idx" ON "herocare_website_included_cards" USING btree ("icon_id");
  CREATE INDEX "herocare_website_how_it_works_steps_order_idx" ON "herocare_website_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "herocare_website_how_it_works_steps_parent_id_idx" ON "herocare_website_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_how_it_works_steps_image_idx" ON "herocare_website_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "herocare_website_why_us_cards_order_idx" ON "herocare_website_why_us_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_why_us_cards_parent_id_idx" ON "herocare_website_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_why_us_cards_image_idx" ON "herocare_website_why_us_cards" USING btree ("image_id");
  CREATE INDEX "herocare_website_faq_items_order_idx" ON "herocare_website_faq_items" USING btree ("_order");
  CREATE INDEX "herocare_website_faq_items_parent_id_idx" ON "herocare_website_faq_items" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_thank_you_plan_cards_order_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_thank_you_plan_cards_parent_id_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_thank_you_plan_cards_icon_idx" ON "herocare_website_thank_you_plan_cards" USING btree ("icon_id");
  CREATE INDEX "herocare_website_landlord_hero_bullet_points_order_idx" ON "herocare_website_landlord_hero_bullet_points" USING btree ("_order");
  CREATE INDEX "herocare_website_landlord_hero_bullet_points_parent_id_idx" ON "herocare_website_landlord_hero_bullet_points" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_landlord_included_cards_order_idx" ON "herocare_website_landlord_included_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_landlord_included_cards_parent_id_idx" ON "herocare_website_landlord_included_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_landlord_included_cards_icon_idx" ON "herocare_website_landlord_included_cards" USING btree ("icon_id");
  CREATE INDEX "herocare_website_landlord_how_it_works_steps_order_idx" ON "herocare_website_landlord_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "herocare_website_landlord_how_it_works_steps_parent_id_idx" ON "herocare_website_landlord_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_landlord_how_it_works_steps_image_idx" ON "herocare_website_landlord_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "herocare_website_landlord_why_us_cards_order_idx" ON "herocare_website_landlord_why_us_cards" USING btree ("_order");
  CREATE INDEX "herocare_website_landlord_why_us_cards_parent_id_idx" ON "herocare_website_landlord_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_landlord_why_us_cards_image_idx" ON "herocare_website_landlord_why_us_cards" USING btree ("image_id");
  CREATE INDEX "herocare_website_landlord_faq_items_order_idx" ON "herocare_website_landlord_faq_items" USING btree ("_order");
  CREATE INDEX "herocare_website_landlord_faq_items_parent_id_idx" ON "herocare_website_landlord_faq_items" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_callout_fee_options_order_idx" ON "herocare_website_callout_fee_options" USING btree ("_order");
  CREATE INDEX "herocare_website_callout_fee_options_parent_id_idx" ON "herocare_website_callout_fee_options" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_plans_order_idx" ON "herocare_website_plans" USING btree ("_order");
  CREATE INDEX "herocare_website_plans_parent_id_idx" ON "herocare_website_plans" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_feature_rows_order_idx" ON "herocare_website_feature_rows" USING btree ("_order");
  CREATE INDEX "herocare_website_feature_rows_parent_id_idx" ON "herocare_website_feature_rows" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_feature_rows_icon_idx" ON "herocare_website_feature_rows" USING btree ("icon_id");
  CREATE INDEX "herocare_website_about_your_plan_accordion_order_idx" ON "herocare_website_about_your_plan_accordion" USING btree ("_order");
  CREATE INDEX "herocare_website_about_your_plan_accordion_parent_id_idx" ON "herocare_website_about_your_plan_accordion" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_about_your_plan_accordion_icon_idx" ON "herocare_website_about_your_plan_accordion" USING btree ("icon_id");
  CREATE INDEX "herocare_website_policies_order_idx" ON "herocare_website_policies" USING btree ("_order");
  CREATE INDEX "herocare_website_policies_parent_id_idx" ON "herocare_website_policies" USING btree ("_parent_id");
  CREATE INDEX "herocare_website_tenant_idx" ON "herocare_website" USING btree ("tenant_id");
  CREATE INDEX "herocare_website_logo_idx" ON "herocare_website" USING btree ("logo_id");
  CREATE INDEX "herocare_website_logo_dark_idx" ON "herocare_website" USING btree ("logo_dark_id");
  CREATE INDEX "herocare_website_favicon_idx" ON "herocare_website" USING btree ("favicon_id");
  CREATE INDEX "herocare_website_emergency_hero_logo_idx" ON "herocare_website" USING btree ("emergency_hero_logo_id");
  CREATE INDEX "herocare_website_hero_image_idx" ON "herocare_website" USING btree ("hero_image_id");
  CREATE INDEX "herocare_website_cta_image_idx" ON "herocare_website" USING btree ("cta_image_id");
  CREATE INDEX "herocare_website_popup_image_idx" ON "herocare_website" USING btree ("popup_image_id");
  CREATE INDEX "herocare_website_landlord_hero_image_idx" ON "herocare_website" USING btree ("landlord_hero_image_id");
  CREATE INDEX "herocare_website_landlord_cta_image_idx" ON "herocare_website" USING btree ("landlord_cta_image_id");
  CREATE INDEX "herocare_website_landlord_popup_image_idx" ON "herocare_website" USING btree ("landlord_popup_image_id");
  CREATE INDEX "herocare_website_updated_at_idx" ON "herocare_website" USING btree ("updated_at");
  CREATE INDEX "herocare_website_created_at_idx" ON "herocare_website" USING btree ("created_at");
  CREATE INDEX "herocare_image_gallery_tenant_idx" ON "herocare_image_gallery" USING btree ("tenant_id");
  CREATE INDEX "herocare_image_gallery_updated_at_idx" ON "herocare_image_gallery" USING btree ("updated_at");
  CREATE INDEX "herocare_image_gallery_created_at_idx" ON "herocare_image_gallery" USING btree ("created_at");
  CREATE UNIQUE INDEX "herocare_image_gallery_filename_idx" ON "herocare_image_gallery" USING btree ("filename");
  CREATE INDEX "herocare_brand_assets_tenant_idx" ON "herocare_brand_assets" USING btree ("tenant_id");
  CREATE INDEX "herocare_brand_assets_updated_at_idx" ON "herocare_brand_assets" USING btree ("updated_at");
  CREATE INDEX "herocare_brand_assets_created_at_idx" ON "herocare_brand_assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "herocare_brand_assets_filename_idx" ON "herocare_brand_assets" USING btree ("filename");
  CREATE INDEX "herocare_email_templates_tenant_idx" ON "herocare_email_templates" USING btree ("tenant_id");
  CREATE INDEX "herocare_email_templates_logo_idx" ON "herocare_email_templates" USING btree ("logo_id");
  CREATE INDEX "herocare_email_templates_updated_at_idx" ON "herocare_email_templates" USING btree ("updated_at");
  CREATE INDEX "herocare_email_templates_created_at_idx" ON "herocare_email_templates" USING btree ("created_at");
  CREATE INDEX "emergency_hero_brand_assets_tenant_idx" ON "emergency_hero_brand_assets" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_brand_assets_updated_at_idx" ON "emergency_hero_brand_assets" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_brand_assets_created_at_idx" ON "emergency_hero_brand_assets" USING btree ("created_at");
  CREATE UNIQUE INDEX "emergency_hero_brand_assets_filename_idx" ON "emergency_hero_brand_assets" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_tenants_id_idx" ON "payload_locked_documents_rels" USING btree ("tenants_id");
  CREATE INDEX "payload_locked_documents_rels_api_keys_id_idx" ON "payload_locked_documents_rels" USING btree ("api_keys_id");
  CREATE INDEX "payload_locked_documents_rels_all_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("all_form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_herocare_website_id_idx" ON "payload_locked_documents_rels" USING btree ("herocare_website_id");
  CREATE INDEX "payload_locked_documents_rels_herocare_image_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("herocare_image_gallery_id");
  CREATE INDEX "payload_locked_documents_rels_herocare_brand_assets_id_idx" ON "payload_locked_documents_rels" USING btree ("herocare_brand_assets_id");
  CREATE INDEX "payload_locked_documents_rels_herocare_email_templates_i_idx" ON "payload_locked_documents_rels" USING btree ("herocare_email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_brand_asset_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_brand_assets_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "users_rels" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "tenants" CASCADE;
  DROP TABLE "api_keys" CASCADE;
  DROP TABLE "all_form_submissions" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "herocare_website_hero_bullet_points" CASCADE;
  DROP TABLE "herocare_website_included_cards" CASCADE;
  DROP TABLE "herocare_website_how_it_works_steps" CASCADE;
  DROP TABLE "herocare_website_why_us_cards" CASCADE;
  DROP TABLE "herocare_website_faq_items" CASCADE;
  DROP TABLE "herocare_website_thank_you_plan_cards" CASCADE;
  DROP TABLE "herocare_website_landlord_hero_bullet_points" CASCADE;
  DROP TABLE "herocare_website_landlord_included_cards" CASCADE;
  DROP TABLE "herocare_website_landlord_how_it_works_steps" CASCADE;
  DROP TABLE "herocare_website_landlord_why_us_cards" CASCADE;
  DROP TABLE "herocare_website_landlord_faq_items" CASCADE;
  DROP TABLE "herocare_website_callout_fee_options" CASCADE;
  DROP TABLE "herocare_website_plans" CASCADE;
  DROP TABLE "herocare_website_feature_rows" CASCADE;
  DROP TABLE "herocare_website_about_your_plan_accordion" CASCADE;
  DROP TABLE "herocare_website_policies" CASCADE;
  DROP TABLE "herocare_website" CASCADE;
  DROP TABLE "herocare_image_gallery" CASCADE;
  DROP TABLE "herocare_brand_assets" CASCADE;
  DROP TABLE "herocare_email_templates" CASCADE;
  DROP TABLE "emergency_hero_brand_assets" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_all_form_submissions_journey";
  DROP TYPE "public"."enum_all_form_submissions_webhook_status";
  DROP TYPE "public"."enum_form_submissions_journey";
  DROP TYPE "public"."enum_form_submissions_webhook_status";
  DROP TYPE "public"."enum_herocare_email_templates_name";`)
}
