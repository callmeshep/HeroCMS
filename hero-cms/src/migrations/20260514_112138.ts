import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "all_form_submissions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "form_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "all_form_submissions" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_all_form_submissions_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_form_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_all_form_submissions_id_idx";
  DROP INDEX "payload_locked_documents_rels_form_submissions_id_idx";
  ALTER TABLE "users" ADD COLUMN "enable_a_p_i_key" boolean;
  ALTER TABLE "users" ADD COLUMN "api_key" varchar;
  ALTER TABLE "users" ADD COLUMN "api_key_index" varchar;
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
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "all_form_submissions_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "form_submissions_id" integer;
  ALTER TABLE "all_form_submissions" ADD CONSTRAINT "all_form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "form_submissions" ADD CONSTRAINT "form_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "all_form_submissions_tenant_idx" ON "all_form_submissions" USING btree ("tenant_id");
  CREATE INDEX "all_form_submissions_updated_at_idx" ON "all_form_submissions" USING btree ("updated_at");
  CREATE INDEX "all_form_submissions_created_at_idx" ON "all_form_submissions" USING btree ("created_at");
  CREATE INDEX "form_submissions_tenant_idx" ON "form_submissions" USING btree ("tenant_id");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_all_form_submissions_fk" FOREIGN KEY ("all_form_submissions_id") REFERENCES "public"."all_form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_all_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("all_form_submissions_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  ALTER TABLE "users" DROP COLUMN "enable_a_p_i_key";
  ALTER TABLE "users" DROP COLUMN "api_key";
  ALTER TABLE "users" DROP COLUMN "api_key_index";`)
}
