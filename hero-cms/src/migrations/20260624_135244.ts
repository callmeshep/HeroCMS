import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_emergency_hero_knowledge_base_category" AS ENUM('plumbing', 'heating', 'electrics', 'drainage', 'locksmiths', 'homecare', 'company');
  CREATE TYPE "public"."enum_emergency_hero_submissions_ghl_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TYPE "public"."enum_emergency_hero_email_templates_template_name" AS ENUM('admin-notification', 'customer-notification');
  CREATE TABLE "emergency_hero_website_app_block_bullets" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_footer_services_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_footer_company_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_footer_policies_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_logo_bar_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "emergency_hero_website_home_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_plumbing_issue_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar
  );
  
  CREATE TABLE "emergency_hero_website_plumbing_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_plumbing_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_plumbing_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_heating_issue_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar
  );
  
  CREATE TABLE "emergency_hero_website_heating_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_heating_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_heating_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_electrics_issue_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar
  );
  
  CREATE TABLE "emergency_hero_website_electrics_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_electrics_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_electrics_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_drainage_issue_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar
  );
  
  CREATE TABLE "emergency_hero_website_drainage_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_drainage_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_drainage_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_locksmiths_issue_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"cta_text" varchar
  );
  
  CREATE TABLE "emergency_hero_website_locksmiths_why_us_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_locksmiths_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_locksmiths_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"answer" jsonb NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_as_seen_on_logos" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "emergency_hero_website_story_blocks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"headline" varchar NOT NULL,
  	"body" jsonb
  );
  
  CREATE TABLE "emergency_hero_website_brand_value_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_bah_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar NOT NULL,
  	"body" varchar
  );
  
  CREATE TABLE "emergency_hero_website_bah_plans" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"cta_text" varchar,
  	"stripe_link" varchar
  );
  
  CREATE TABLE "emergency_hero_website_bah_feature_rows_plan_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_bah_feature_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"feature_name" varchar NOT NULL
  );
  
  CREATE TABLE "emergency_hero_website_bah_trade_documents_required_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"required" boolean DEFAULT true
  );
  
  CREATE TABLE "emergency_hero_website_bah_trade_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trade_name" varchar NOT NULL,
  	"trade_plural_label" varchar NOT NULL,
  	"microcopy" jsonb
  );
  
  CREATE TABLE "emergency_hero_website_eh_policies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb
  );
  
  CREATE TABLE "emergency_hero_website" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar DEFAULT 'Emergency Hero Website',
  	"logo_light_id" integer,
  	"logo_dark_id" integer,
  	"favicon_id" integer,
  	"phone_number" varchar,
  	"nav_cta_text" varchar,
  	"trustpilot_rating" numeric,
  	"trustpilot_review_count" varchar,
  	"trustpilot_platforms_label" varchar,
  	"app_store_url" varchar,
  	"google_play_url" varchar,
  	"app_screenshot_image_id" integer,
  	"app_block_headline" varchar,
  	"app_block_body" jsonb,
  	"bottom_cta_headline" varchar,
  	"bottom_cta_button_text" varchar,
  	"bottom_cta_image_left_id" integer,
  	"bottom_cta_image_right_id" integer,
  	"footer_strapline" varchar,
  	"footer_facebook_url" varchar,
  	"footer_instagram_url" varchar,
  	"footer_twitter_url" varchar,
  	"footer_app_banner_image_id" integer,
  	"footer_copyright_text" varchar,
  	"mobile_menu_image_left_id" integer,
  	"mobile_menu_image_right_id" integer,
  	"home_hero_background_image_id" integer,
  	"home_hero_headline" varchar,
  	"home_hero_subheading" varchar,
  	"home_hero_form_cta_text" varchar,
  	"home_hero_image_left_id" integer,
  	"home_hero_image_right_id" integer,
  	"services_grid_headline" varchar,
  	"services_grid_subheading" varchar,
  	"homecare_card_headline" varchar,
  	"homecare_card_body" varchar,
  	"homecare_card_cta_text" varchar,
  	"homecare_card_cta_url" varchar DEFAULT 'https://herocare.co.uk',
  	"homecare_card_image_id" integer,
  	"homecare_card_accent_colour" varchar,
  	"who_we_are_headline" varchar,
  	"who_we_are_subheading" varchar,
  	"who_we_are_video_url" varchar,
  	"home_faqs_headline" varchar,
  	"home_faqs_body" jsonb,
  	"home_faqs_have_another_question" varchar,
  	"knowledge_base_headline" varchar,
  	"plumbing_hero_bg_image_id" integer,
  	"plumbing_hero_headline" varchar,
  	"plumbing_hero_subheading" varchar,
  	"plumbing_hero_form_cta_text" varchar,
  	"plumbing_issues_headline" varchar,
  	"plumbing_issues_subheading" varchar,
  	"plumbing_why_us_headline" varchar,
  	"plumbing_why_us_subheading" varchar,
  	"plumbing_how_it_works_headline" varchar,
  	"plumbing_faqs_headline" varchar,
  	"plumbing_faqs_body" jsonb,
  	"plumbing_ty_subheading" varchar,
  	"plumbing_ty_call_cta_text" varchar,
  	"heating_hero_bg_image_id" integer,
  	"heating_hero_headline" varchar,
  	"heating_hero_subheading" varchar,
  	"heating_hero_form_cta_text" varchar,
  	"heating_issues_headline" varchar,
  	"heating_issues_subheading" varchar,
  	"heating_why_us_headline" varchar,
  	"heating_why_us_subheading" varchar,
  	"heating_how_it_works_headline" varchar,
  	"heating_faqs_headline" varchar,
  	"heating_faqs_body" jsonb,
  	"heating_ty_subheading" varchar,
  	"heating_ty_call_cta_text" varchar,
  	"electrics_hero_bg_image_id" integer,
  	"electrics_hero_headline" varchar,
  	"electrics_hero_subheading" varchar,
  	"electrics_hero_form_cta_text" varchar,
  	"electrics_issues_headline" varchar,
  	"electrics_issues_subheading" varchar,
  	"electrics_why_us_headline" varchar,
  	"electrics_why_us_subheading" varchar,
  	"electrics_how_it_works_headline" varchar,
  	"electrics_faqs_headline" varchar,
  	"electrics_faqs_body" jsonb,
  	"electrics_ty_subheading" varchar,
  	"electrics_ty_call_cta_text" varchar,
  	"drainage_hero_bg_image_id" integer,
  	"drainage_hero_headline" varchar,
  	"drainage_hero_subheading" varchar,
  	"drainage_hero_form_cta_text" varchar,
  	"drainage_issues_headline" varchar,
  	"drainage_issues_subheading" varchar,
  	"drainage_why_us_headline" varchar,
  	"drainage_why_us_subheading" varchar,
  	"drainage_how_it_works_headline" varchar,
  	"drainage_faqs_headline" varchar,
  	"drainage_faqs_body" jsonb,
  	"drainage_ty_subheading" varchar,
  	"drainage_ty_call_cta_text" varchar,
  	"locksmiths_hero_bg_image_id" integer,
  	"locksmiths_hero_headline" varchar,
  	"locksmiths_hero_subheading" varchar,
  	"locksmiths_hero_form_cta_text" varchar,
  	"locksmiths_issues_headline" varchar,
  	"locksmiths_issues_subheading" varchar,
  	"locksmiths_why_us_headline" varchar,
  	"locksmiths_why_us_subheading" varchar,
  	"locksmiths_how_it_works_headline" varchar,
  	"locksmiths_faqs_headline" varchar,
  	"locksmiths_faqs_body" jsonb,
  	"locksmiths_ty_subheading" varchar,
  	"locksmiths_ty_call_cta_text" varchar,
  	"kb_hero_bg_image_id" integer,
  	"kb_hero_headline" varchar,
  	"kb_hero_subheading" varchar,
  	"kb_grid_headline" varchar,
  	"about_hero_bg_image_id" integer,
  	"about_hero_headline" varchar,
  	"about_hero_subheading" varchar,
  	"as_seen_on_label" varchar,
  	"brand_values_headline" varchar,
  	"brand_values_subheading" varchar,
  	"team_headline" varchar,
  	"team_body" jsonb,
  	"bah_hero_bg_image_id" integer,
  	"bah_hero_headline" varchar,
  	"bah_hero_subheading" varchar,
  	"bah_hero_cta_text" varchar,
  	"bah_how_it_works_headline" varchar,
  	"bah_plans_headline" varchar,
  	"bah_plans_subheading" varchar,
  	"bah_plans_footnote" jsonb,
  	"bah_story_image_id" integer,
  	"bah_story_headline" varchar,
  	"bah_story_body" jsonb,
  	"bah_story_cta_text" varchar,
  	"bah_story_cta_link" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"service_name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"accent_colour" varchar,
  	"nav_label" varchar,
  	"hero_character_image_id" integer,
  	"hero_background_image_id" integer,
  	"review_category" varchar,
  	"rng_min" numeric,
  	"rng_max" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_knowledge_base" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"category" "enum_emergency_hero_knowledge_base_category" NOT NULL,
  	"excerpt" varchar,
  	"hero_image_id" integer,
  	"body_content" jsonb,
  	"featured" boolean DEFAULT false,
  	"published_at" timestamp(3) with time zone,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"job_title" varchar,
  	"photo_id" integer,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_submissions_skills" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trade" varchar
  );
  
  CREATE TABLE "emergency_hero_submissions_uploaded_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"trade_name" varchar,
  	"document_label" varchar,
  	"file_url" varchar
  );
  
  CREATE TABLE "emergency_hero_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" varchar,
  	"company_name" varchar,
  	"company_type" varchar,
  	"email" varchar,
  	"mobile" varchar,
  	"website" varchar,
  	"working_days_hours" varchar,
  	"postcode" varchar,
  	"coverage_radius" numeric,
  	"comments" varchar,
  	"submitted_at" timestamp(3) with time zone,
  	"ghl_webhook_status" "enum_emergency_hero_submissions_ghl_webhook_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "emergency_hero_image_gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"alt_text" varchar,
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
  
  CREATE TABLE "emergency_hero_email_templates" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"template_name" "enum_emergency_hero_email_templates_template_name" NOT NULL,
  	"subject_line" varchar,
  	"heading" varchar,
  	"body" jsonb,
  	"button_text" varchar,
  	"button_url" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_website_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_services_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_knowledge_base_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_team_members_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_image_gallery_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "emergency_hero_email_templates_id" integer;
  ALTER TABLE "emergency_hero_website_app_block_bullets" ADD CONSTRAINT "emergency_hero_website_app_block_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_footer_services_links" ADD CONSTRAINT "emergency_hero_website_footer_services_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_footer_company_links" ADD CONSTRAINT "emergency_hero_website_footer_company_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_footer_policies_links" ADD CONSTRAINT "emergency_hero_website_footer_policies_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_logo_bar_logos" ADD CONSTRAINT "emergency_hero_website_logo_bar_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_logo_bar_logos" ADD CONSTRAINT "emergency_hero_website_logo_bar_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_home_faq_items" ADD CONSTRAINT "emergency_hero_website_home_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_issue_cards" ADD CONSTRAINT "emergency_hero_website_plumbing_issue_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_issue_cards" ADD CONSTRAINT "emergency_hero_website_plumbing_issue_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_why_us_cards" ADD CONSTRAINT "emergency_hero_website_plumbing_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_why_us_cards" ADD CONSTRAINT "emergency_hero_website_plumbing_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_plumbing_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_plumbing_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_plumbing_faq_items" ADD CONSTRAINT "emergency_hero_website_plumbing_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_issue_cards" ADD CONSTRAINT "emergency_hero_website_heating_issue_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_issue_cards" ADD CONSTRAINT "emergency_hero_website_heating_issue_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_why_us_cards" ADD CONSTRAINT "emergency_hero_website_heating_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_why_us_cards" ADD CONSTRAINT "emergency_hero_website_heating_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_heating_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_heating_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_heating_faq_items" ADD CONSTRAINT "emergency_hero_website_heating_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_issue_cards" ADD CONSTRAINT "emergency_hero_website_electrics_issue_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_issue_cards" ADD CONSTRAINT "emergency_hero_website_electrics_issue_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_why_us_cards" ADD CONSTRAINT "emergency_hero_website_electrics_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_why_us_cards" ADD CONSTRAINT "emergency_hero_website_electrics_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_electrics_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_electrics_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_electrics_faq_items" ADD CONSTRAINT "emergency_hero_website_electrics_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_issue_cards" ADD CONSTRAINT "emergency_hero_website_drainage_issue_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_issue_cards" ADD CONSTRAINT "emergency_hero_website_drainage_issue_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_why_us_cards" ADD CONSTRAINT "emergency_hero_website_drainage_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_why_us_cards" ADD CONSTRAINT "emergency_hero_website_drainage_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_drainage_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_drainage_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_drainage_faq_items" ADD CONSTRAINT "emergency_hero_website_drainage_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_issue_cards" ADD CONSTRAINT "emergency_hero_website_locksmiths_issue_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_issue_cards" ADD CONSTRAINT "emergency_hero_website_locksmiths_issue_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_why_us_cards" ADD CONSTRAINT "emergency_hero_website_locksmiths_why_us_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_why_us_cards" ADD CONSTRAINT "emergency_hero_website_locksmiths_why_us_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_locksmiths_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_locksmiths_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_locksmiths_faq_items" ADD CONSTRAINT "emergency_hero_website_locksmiths_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_as_seen_on_logos" ADD CONSTRAINT "emergency_hero_website_as_seen_on_logos_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_as_seen_on_logos" ADD CONSTRAINT "emergency_hero_website_as_seen_on_logos_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_story_blocks" ADD CONSTRAINT "emergency_hero_website_story_blocks_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_story_blocks" ADD CONSTRAINT "emergency_hero_website_story_blocks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_brand_value_cards" ADD CONSTRAINT "emergency_hero_website_brand_value_cards_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_brand_value_cards" ADD CONSTRAINT "emergency_hero_website_brand_value_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_bah_how_it_works_steps_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_how_it_works_steps" ADD CONSTRAINT "emergency_hero_website_bah_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_plans" ADD CONSTRAINT "emergency_hero_website_bah_plans_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_feature_rows_plan_values" ADD CONSTRAINT "emergency_hero_website_bah_feature_rows_plan_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website_bah_feature_rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_feature_rows" ADD CONSTRAINT "emergency_hero_website_bah_feature_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_trade_documents_required_documents" ADD CONSTRAINT "emergency_hero_website_bah_trade_documents_required_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website_bah_trade_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_bah_trade_documents" ADD CONSTRAINT "emergency_hero_website_bah_trade_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website_eh_policies" ADD CONSTRAINT "emergency_hero_website_eh_policies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_logo_light_id_media_id_fk" FOREIGN KEY ("logo_light_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_logo_dark_id_media_id_fk" FOREIGN KEY ("logo_dark_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_app_screenshot_image_id_media_id_fk" FOREIGN KEY ("app_screenshot_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_bottom_cta_image_left_id_media_id_fk" FOREIGN KEY ("bottom_cta_image_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_bottom_cta_image_right_id_media_id_fk" FOREIGN KEY ("bottom_cta_image_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_footer_app_banner_image_id_media_id_fk" FOREIGN KEY ("footer_app_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_mobile_menu_image_left_id_media_id_fk" FOREIGN KEY ("mobile_menu_image_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_mobile_menu_image_right_id_media_id_fk" FOREIGN KEY ("mobile_menu_image_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_home_hero_background_image_id_media_id_fk" FOREIGN KEY ("home_hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_home_hero_image_left_id_media_id_fk" FOREIGN KEY ("home_hero_image_left_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_home_hero_image_right_id_media_id_fk" FOREIGN KEY ("home_hero_image_right_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_homecare_card_image_id_media_id_fk" FOREIGN KEY ("homecare_card_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_plumbing_hero_bg_image_id_media_id_fk" FOREIGN KEY ("plumbing_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_heating_hero_bg_image_id_media_id_fk" FOREIGN KEY ("heating_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_electrics_hero_bg_image_id_media_id_fk" FOREIGN KEY ("electrics_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_drainage_hero_bg_image_id_media_id_fk" FOREIGN KEY ("drainage_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_locksmiths_hero_bg_image_id_media_id_fk" FOREIGN KEY ("locksmiths_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_kb_hero_bg_image_id_media_id_fk" FOREIGN KEY ("kb_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_about_hero_bg_image_id_media_id_fk" FOREIGN KEY ("about_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_bah_hero_bg_image_id_media_id_fk" FOREIGN KEY ("bah_hero_bg_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_bah_story_image_id_media_id_fk" FOREIGN KEY ("bah_story_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_hero_character_image_id_media_id_fk" FOREIGN KEY ("hero_character_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_hero_background_image_id_media_id_fk" FOREIGN KEY ("hero_background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_knowledge_base" ADD CONSTRAINT "emergency_hero_knowledge_base_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_knowledge_base" ADD CONSTRAINT "emergency_hero_knowledge_base_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_team_members" ADD CONSTRAINT "emergency_hero_team_members_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_team_members" ADD CONSTRAINT "emergency_hero_team_members_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_submissions_skills" ADD CONSTRAINT "emergency_hero_submissions_skills_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_submissions_uploaded_documents" ADD CONSTRAINT "emergency_hero_submissions_uploaded_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."emergency_hero_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "emergency_hero_submissions" ADD CONSTRAINT "emergency_hero_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_image_gallery" ADD CONSTRAINT "emergency_hero_image_gallery_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_email_templates" ADD CONSTRAINT "emergency_hero_email_templates_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  
  CREATE INDEX "emergency_hero_website_app_block_bullets_order_idx" ON "emergency_hero_website_app_block_bullets" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_app_block_bullets_parent_id_idx" ON "emergency_hero_website_app_block_bullets" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_footer_services_links_order_idx" ON "emergency_hero_website_footer_services_links" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_footer_services_links_parent_id_idx" ON "emergency_hero_website_footer_services_links" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_footer_company_links_order_idx" ON "emergency_hero_website_footer_company_links" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_footer_company_links_parent_id_idx" ON "emergency_hero_website_footer_company_links" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_footer_policies_links_order_idx" ON "emergency_hero_website_footer_policies_links" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_footer_policies_links_parent_id_idx" ON "emergency_hero_website_footer_policies_links" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_logo_bar_logos_order_idx" ON "emergency_hero_website_logo_bar_logos" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_logo_bar_logos_parent_id_idx" ON "emergency_hero_website_logo_bar_logos" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_logo_bar_logos_image_idx" ON "emergency_hero_website_logo_bar_logos" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_home_faq_items_order_idx" ON "emergency_hero_website_home_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_home_faq_items_parent_id_idx" ON "emergency_hero_website_home_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_plumbing_issue_cards_order_idx" ON "emergency_hero_website_plumbing_issue_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_plumbing_issue_cards_parent_id_idx" ON "emergency_hero_website_plumbing_issue_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_plumbing_issue_cards_icon_idx" ON "emergency_hero_website_plumbing_issue_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_plumbing_why_us_cards_order_idx" ON "emergency_hero_website_plumbing_why_us_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_plumbing_why_us_cards_parent_id_idx" ON "emergency_hero_website_plumbing_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_plumbing_why_us_cards_icon_idx" ON "emergency_hero_website_plumbing_why_us_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_plumbing_how_it_works_steps_order_idx" ON "emergency_hero_website_plumbing_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_plumbing_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_plumbing_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_plumbing_how_it_works_steps_image_idx" ON "emergency_hero_website_plumbing_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_plumbing_faq_items_order_idx" ON "emergency_hero_website_plumbing_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_plumbing_faq_items_parent_id_idx" ON "emergency_hero_website_plumbing_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_heating_issue_cards_order_idx" ON "emergency_hero_website_heating_issue_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_heating_issue_cards_parent_id_idx" ON "emergency_hero_website_heating_issue_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_heating_issue_cards_icon_idx" ON "emergency_hero_website_heating_issue_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_heating_why_us_cards_order_idx" ON "emergency_hero_website_heating_why_us_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_heating_why_us_cards_parent_id_idx" ON "emergency_hero_website_heating_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_heating_why_us_cards_icon_idx" ON "emergency_hero_website_heating_why_us_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_heating_how_it_works_steps_order_idx" ON "emergency_hero_website_heating_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_heating_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_heating_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_heating_how_it_works_steps_image_idx" ON "emergency_hero_website_heating_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_heating_faq_items_order_idx" ON "emergency_hero_website_heating_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_heating_faq_items_parent_id_idx" ON "emergency_hero_website_heating_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_electrics_issue_cards_order_idx" ON "emergency_hero_website_electrics_issue_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_electrics_issue_cards_parent_id_idx" ON "emergency_hero_website_electrics_issue_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_electrics_issue_cards_icon_idx" ON "emergency_hero_website_electrics_issue_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_electrics_why_us_cards_order_idx" ON "emergency_hero_website_electrics_why_us_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_electrics_why_us_cards_parent_id_idx" ON "emergency_hero_website_electrics_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_electrics_why_us_cards_icon_idx" ON "emergency_hero_website_electrics_why_us_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_electrics_how_it_works_steps_order_idx" ON "emergency_hero_website_electrics_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_electrics_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_electrics_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_electrics_how_it_works_steps_imag_idx" ON "emergency_hero_website_electrics_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_electrics_faq_items_order_idx" ON "emergency_hero_website_electrics_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_electrics_faq_items_parent_id_idx" ON "emergency_hero_website_electrics_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_drainage_issue_cards_order_idx" ON "emergency_hero_website_drainage_issue_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_drainage_issue_cards_parent_id_idx" ON "emergency_hero_website_drainage_issue_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_drainage_issue_cards_icon_idx" ON "emergency_hero_website_drainage_issue_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_drainage_why_us_cards_order_idx" ON "emergency_hero_website_drainage_why_us_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_drainage_why_us_cards_parent_id_idx" ON "emergency_hero_website_drainage_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_drainage_why_us_cards_icon_idx" ON "emergency_hero_website_drainage_why_us_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_drainage_how_it_works_steps_order_idx" ON "emergency_hero_website_drainage_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_drainage_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_drainage_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_drainage_how_it_works_steps_image_idx" ON "emergency_hero_website_drainage_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_drainage_faq_items_order_idx" ON "emergency_hero_website_drainage_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_drainage_faq_items_parent_id_idx" ON "emergency_hero_website_drainage_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_locksmiths_issue_cards_order_idx" ON "emergency_hero_website_locksmiths_issue_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_locksmiths_issue_cards_parent_id_idx" ON "emergency_hero_website_locksmiths_issue_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_locksmiths_issue_cards_icon_idx" ON "emergency_hero_website_locksmiths_issue_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_locksmiths_why_us_cards_order_idx" ON "emergency_hero_website_locksmiths_why_us_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_locksmiths_why_us_cards_parent_id_idx" ON "emergency_hero_website_locksmiths_why_us_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_locksmiths_why_us_cards_icon_idx" ON "emergency_hero_website_locksmiths_why_us_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_locksmiths_how_it_works_steps_order_idx" ON "emergency_hero_website_locksmiths_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_locksmiths_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_locksmiths_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_locksmiths_how_it_works_steps_ima_idx" ON "emergency_hero_website_locksmiths_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_locksmiths_faq_items_order_idx" ON "emergency_hero_website_locksmiths_faq_items" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_locksmiths_faq_items_parent_id_idx" ON "emergency_hero_website_locksmiths_faq_items" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_as_seen_on_logos_order_idx" ON "emergency_hero_website_as_seen_on_logos" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_as_seen_on_logos_parent_id_idx" ON "emergency_hero_website_as_seen_on_logos" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_as_seen_on_logos_image_idx" ON "emergency_hero_website_as_seen_on_logos" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_story_blocks_order_idx" ON "emergency_hero_website_story_blocks" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_story_blocks_parent_id_idx" ON "emergency_hero_website_story_blocks" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_story_blocks_image_idx" ON "emergency_hero_website_story_blocks" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_brand_value_cards_order_idx" ON "emergency_hero_website_brand_value_cards" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_brand_value_cards_parent_id_idx" ON "emergency_hero_website_brand_value_cards" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_brand_value_cards_icon_idx" ON "emergency_hero_website_brand_value_cards" USING btree ("icon_id");
  CREATE INDEX "emergency_hero_website_bah_how_it_works_steps_order_idx" ON "emergency_hero_website_bah_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_how_it_works_steps_parent_id_idx" ON "emergency_hero_website_bah_how_it_works_steps" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_bah_how_it_works_steps_image_idx" ON "emergency_hero_website_bah_how_it_works_steps" USING btree ("image_id");
  CREATE INDEX "emergency_hero_website_bah_plans_order_idx" ON "emergency_hero_website_bah_plans" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_plans_parent_id_idx" ON "emergency_hero_website_bah_plans" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_bah_feature_rows_plan_values_order_idx" ON "emergency_hero_website_bah_feature_rows_plan_values" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_feature_rows_plan_values_parent_id_idx" ON "emergency_hero_website_bah_feature_rows_plan_values" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_bah_feature_rows_order_idx" ON "emergency_hero_website_bah_feature_rows" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_feature_rows_parent_id_idx" ON "emergency_hero_website_bah_feature_rows" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_bah_trade_documents_required_documents_order_idx" ON "emergency_hero_website_bah_trade_documents_required_documents" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_trade_documents_required_documents_parent_id_idx" ON "emergency_hero_website_bah_trade_documents_required_documents" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_bah_trade_documents_order_idx" ON "emergency_hero_website_bah_trade_documents" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_bah_trade_documents_parent_id_idx" ON "emergency_hero_website_bah_trade_documents" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_eh_policies_order_idx" ON "emergency_hero_website_eh_policies" USING btree ("_order");
  CREATE INDEX "emergency_hero_website_eh_policies_parent_id_idx" ON "emergency_hero_website_eh_policies" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_website_tenant_idx" ON "emergency_hero_website" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_website_logo_light_idx" ON "emergency_hero_website" USING btree ("logo_light_id");
  CREATE INDEX "emergency_hero_website_logo_dark_idx" ON "emergency_hero_website" USING btree ("logo_dark_id");
  CREATE INDEX "emergency_hero_website_favicon_idx" ON "emergency_hero_website" USING btree ("favicon_id");
  CREATE INDEX "emergency_hero_website_app_screenshot_image_idx" ON "emergency_hero_website" USING btree ("app_screenshot_image_id");
  CREATE INDEX "emergency_hero_website_bottom_cta_image_left_idx" ON "emergency_hero_website" USING btree ("bottom_cta_image_left_id");
  CREATE INDEX "emergency_hero_website_bottom_cta_image_right_idx" ON "emergency_hero_website" USING btree ("bottom_cta_image_right_id");
  CREATE INDEX "emergency_hero_website_footer_app_banner_image_idx" ON "emergency_hero_website" USING btree ("footer_app_banner_image_id");
  CREATE INDEX "emergency_hero_website_mobile_menu_image_left_idx" ON "emergency_hero_website" USING btree ("mobile_menu_image_left_id");
  CREATE INDEX "emergency_hero_website_mobile_menu_image_right_idx" ON "emergency_hero_website" USING btree ("mobile_menu_image_right_id");
  CREATE INDEX "emergency_hero_website_home_hero_background_image_idx" ON "emergency_hero_website" USING btree ("home_hero_background_image_id");
  CREATE INDEX "emergency_hero_website_home_hero_image_left_idx" ON "emergency_hero_website" USING btree ("home_hero_image_left_id");
  CREATE INDEX "emergency_hero_website_home_hero_image_right_idx" ON "emergency_hero_website" USING btree ("home_hero_image_right_id");
  CREATE INDEX "emergency_hero_website_homecare_card_image_idx" ON "emergency_hero_website" USING btree ("homecare_card_image_id");
  CREATE INDEX "emergency_hero_website_plumbing_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("plumbing_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_heating_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("heating_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_electrics_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("electrics_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_drainage_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("drainage_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_locksmiths_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("locksmiths_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_kb_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("kb_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_about_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("about_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_bah_hero_bg_image_idx" ON "emergency_hero_website" USING btree ("bah_hero_bg_image_id");
  CREATE INDEX "emergency_hero_website_bah_story_image_idx" ON "emergency_hero_website" USING btree ("bah_story_image_id");
  CREATE INDEX "emergency_hero_website_updated_at_idx" ON "emergency_hero_website" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_website_created_at_idx" ON "emergency_hero_website" USING btree ("created_at");
  CREATE INDEX "emergency_hero_services_tenant_idx" ON "emergency_hero_services" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_services_hero_character_image_idx" ON "emergency_hero_services" USING btree ("hero_character_image_id");
  CREATE INDEX "emergency_hero_services_hero_background_image_idx" ON "emergency_hero_services" USING btree ("hero_background_image_id");
  CREATE INDEX "emergency_hero_services_updated_at_idx" ON "emergency_hero_services" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_services_created_at_idx" ON "emergency_hero_services" USING btree ("created_at");
  CREATE INDEX "emergency_hero_knowledge_base_tenant_idx" ON "emergency_hero_knowledge_base" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_knowledge_base_hero_image_idx" ON "emergency_hero_knowledge_base" USING btree ("hero_image_id");
  CREATE INDEX "emergency_hero_knowledge_base_updated_at_idx" ON "emergency_hero_knowledge_base" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_knowledge_base_created_at_idx" ON "emergency_hero_knowledge_base" USING btree ("created_at");
  CREATE INDEX "emergency_hero_team_members_tenant_idx" ON "emergency_hero_team_members" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_team_members_photo_idx" ON "emergency_hero_team_members" USING btree ("photo_id");
  CREATE INDEX "emergency_hero_team_members_updated_at_idx" ON "emergency_hero_team_members" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_team_members_created_at_idx" ON "emergency_hero_team_members" USING btree ("created_at");
  CREATE INDEX "emergency_hero_submissions_skills_order_idx" ON "emergency_hero_submissions_skills" USING btree ("_order");
  CREATE INDEX "emergency_hero_submissions_skills_parent_id_idx" ON "emergency_hero_submissions_skills" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_submissions_uploaded_documents_order_idx" ON "emergency_hero_submissions_uploaded_documents" USING btree ("_order");
  CREATE INDEX "emergency_hero_submissions_uploaded_documents_parent_id_idx" ON "emergency_hero_submissions_uploaded_documents" USING btree ("_parent_id");
  CREATE INDEX "emergency_hero_submissions_tenant_idx" ON "emergency_hero_submissions" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_submissions_updated_at_idx" ON "emergency_hero_submissions" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_submissions_created_at_idx" ON "emergency_hero_submissions" USING btree ("created_at");
  CREATE INDEX "emergency_hero_image_gallery_tenant_idx" ON "emergency_hero_image_gallery" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_image_gallery_updated_at_idx" ON "emergency_hero_image_gallery" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_image_gallery_created_at_idx" ON "emergency_hero_image_gallery" USING btree ("created_at");
  CREATE UNIQUE INDEX "emergency_hero_image_gallery_filename_idx" ON "emergency_hero_image_gallery" USING btree ("filename");
  CREATE INDEX "emergency_hero_email_templates_tenant_idx" ON "emergency_hero_email_templates" USING btree ("tenant_id");
  CREATE INDEX "emergency_hero_email_templates_updated_at_idx" ON "emergency_hero_email_templates" USING btree ("updated_at");
  CREATE INDEX "emergency_hero_email_templates_created_at_idx" ON "emergency_hero_email_templates" USING btree ("created_at");
  
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_website_fk" FOREIGN KEY ("emergency_hero_website_id") REFERENCES "public"."emergency_hero_website"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_services_fk" FOREIGN KEY ("emergency_hero_services_id") REFERENCES "public"."emergency_hero_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_knowledge_ba_fk" FOREIGN KEY ("emergency_hero_knowledge_base_id") REFERENCES "public"."emergency_hero_knowledge_base"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_team_members_fk" FOREIGN KEY ("emergency_hero_team_members_id") REFERENCES "public"."emergency_hero_team_members"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_submissions_fk" FOREIGN KEY ("emergency_hero_submissions_id") REFERENCES "public"."emergency_hero_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_image_galler_fk" FOREIGN KEY ("emergency_hero_image_gallery_id") REFERENCES "public"."emergency_hero_image_gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_emergency_hero_email_templa_fk" FOREIGN KEY ("emergency_hero_email_templates_id") REFERENCES "public"."emergency_hero_email_templates"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_review_website_website_fk" FOREIGN KEY ("review_website_website_id") REFERENCES "public"."review_website_website"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_website_id_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_website_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_services_id_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_services_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_knowledge_b_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_knowledge_base_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_team_member_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_team_members_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_submissions_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_image_galle_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_image_gallery_id");
  CREATE INDEX "payload_locked_documents_rels_emergency_hero_email_templ_idx" ON "payload_locked_documents_rels" USING btree ("emergency_hero_email_templates_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");
  CREATE INDEX "payload_locked_documents_rels_review_website_website_id_idx" ON "payload_locked_documents_rels" USING btree ("review_website_website_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_website_app_block_bullets" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_footer_services_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_footer_company_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_footer_policies_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_logo_bar_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_home_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_plumbing_issue_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_plumbing_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_plumbing_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_plumbing_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_heating_issue_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_heating_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_heating_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_heating_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_electrics_issue_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_electrics_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_electrics_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_electrics_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_drainage_issue_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_drainage_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_drainage_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_drainage_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_locksmiths_issue_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_locksmiths_why_us_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_locksmiths_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_locksmiths_faq_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_as_seen_on_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_story_blocks" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_brand_value_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_how_it_works_steps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_feature_rows_plan_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_feature_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_trade_documents_required_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_bah_trade_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website_eh_policies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_website" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_services" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_knowledge_base" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_team_members" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_submissions_skills" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_submissions_uploaded_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_image_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "emergency_hero_email_templates" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "review_website_website_platform_logos" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "review_website_website_filter_images" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "review_website_website" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "emergency_hero_website_app_block_bullets" CASCADE;
  DROP TABLE "emergency_hero_website_footer_services_links" CASCADE;
  DROP TABLE "emergency_hero_website_footer_company_links" CASCADE;
  DROP TABLE "emergency_hero_website_footer_policies_links" CASCADE;
  DROP TABLE "emergency_hero_website_logo_bar_logos" CASCADE;
  DROP TABLE "emergency_hero_website_home_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_plumbing_issue_cards" CASCADE;
  DROP TABLE "emergency_hero_website_plumbing_why_us_cards" CASCADE;
  DROP TABLE "emergency_hero_website_plumbing_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_plumbing_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_heating_issue_cards" CASCADE;
  DROP TABLE "emergency_hero_website_heating_why_us_cards" CASCADE;
  DROP TABLE "emergency_hero_website_heating_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_heating_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_electrics_issue_cards" CASCADE;
  DROP TABLE "emergency_hero_website_electrics_why_us_cards" CASCADE;
  DROP TABLE "emergency_hero_website_electrics_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_electrics_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_drainage_issue_cards" CASCADE;
  DROP TABLE "emergency_hero_website_drainage_why_us_cards" CASCADE;
  DROP TABLE "emergency_hero_website_drainage_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_drainage_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_locksmiths_issue_cards" CASCADE;
  DROP TABLE "emergency_hero_website_locksmiths_why_us_cards" CASCADE;
  DROP TABLE "emergency_hero_website_locksmiths_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_locksmiths_faq_items" CASCADE;
  DROP TABLE "emergency_hero_website_as_seen_on_logos" CASCADE;
  DROP TABLE "emergency_hero_website_story_blocks" CASCADE;
  DROP TABLE "emergency_hero_website_brand_value_cards" CASCADE;
  DROP TABLE "emergency_hero_website_bah_how_it_works_steps" CASCADE;
  DROP TABLE "emergency_hero_website_bah_plans" CASCADE;
  DROP TABLE "emergency_hero_website_bah_feature_rows_plan_values" CASCADE;
  DROP TABLE "emergency_hero_website_bah_feature_rows" CASCADE;
  DROP TABLE "emergency_hero_website_bah_trade_documents_required_documents" CASCADE;
  DROP TABLE "emergency_hero_website_bah_trade_documents" CASCADE;
  DROP TABLE "emergency_hero_website_eh_policies" CASCADE;
  DROP TABLE "emergency_hero_website" CASCADE;
  DROP TABLE "emergency_hero_services" CASCADE;
  DROP TABLE "emergency_hero_knowledge_base" CASCADE;
  DROP TABLE "emergency_hero_team_members" CASCADE;
  DROP TABLE "emergency_hero_submissions_skills" CASCADE;
  DROP TABLE "emergency_hero_submissions_uploaded_documents" CASCADE;
  DROP TABLE "emergency_hero_submissions" CASCADE;
  DROP TABLE "emergency_hero_image_gallery" CASCADE;
  DROP TABLE "emergency_hero_email_templates" CASCADE;
  DROP TABLE "reviews" CASCADE;
  DROP TABLE "review_website_website_platform_logos" CASCADE;
  DROP TABLE "review_website_website_filter_images" CASCADE;
  DROP TABLE "review_website_website" CASCADE;
  ALTER TABLE "herocare_website" DROP CONSTRAINT "herocare_website_hero_background_image_id_media_id_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_website_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_services_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_knowledge_ba_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_team_members_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_image_galler_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_emergency_hero_email_templa_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reviews_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_review_website_website_fk";
  
  DROP INDEX "herocare_website_hero_background_image_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_website_id_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_services_id_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_knowledge_b_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_team_member_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_submissions_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_image_galle_idx";
  DROP INDEX "payload_locked_documents_rels_emergency_hero_email_templ_idx";
  DROP INDEX "payload_locked_documents_rels_reviews_id_idx";
  DROP INDEX "payload_locked_documents_rels_review_website_website_id_idx";
  ALTER TABLE "herocare_website" DROP COLUMN "hero_background_image_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_website_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_services_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_knowledge_base_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_team_members_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_submissions_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_image_gallery_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "emergency_hero_email_templates_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reviews_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "review_website_website_id";
  DROP TYPE "public"."enum_emergency_hero_knowledge_base_category";
  DROP TYPE "public"."enum_emergency_hero_submissions_ghl_webhook_status";
  DROP TYPE "public"."enum_emergency_hero_email_templates_template_name";
  DROP TYPE "public"."enum_reviews_rating";
  DROP TYPE "public"."enum_reviews_service_type";
  DROP TYPE "public"."enum_review_website_website_filter_images_service_type";`)
}
