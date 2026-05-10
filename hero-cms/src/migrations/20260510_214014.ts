import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_herocare_submissions_journey" AS ENUM('homeowner', 'landlord');
  CREATE TYPE "public"."enum_herocare_submissions_trigger" AS ENUM('button-click', 'header-form');
  CREATE TYPE "public"."enum_herocare_submissions_stage" AS ENUM('step-1', 'step-2');
  CREATE TYPE "public"."enum_herocare_submissions_device" AS ENUM('desktop', 'mobile', 'tablet');
  CREATE TYPE "public"."enum_herocare_submissions_webhook_status" AS ENUM('pending', 'sent', 'failed');
  CREATE TABLE "herocare_forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"page" varchar NOT NULL,
  	"views" numeric DEFAULT 0,
  	"attempts" numeric DEFAULT 0,
  	"completions" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "herocare_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"tenant_id" integer NOT NULL,
  	"form_id" integer NOT NULL,
  	"journey" "enum_herocare_submissions_journey" NOT NULL,
  	"trigger" "enum_herocare_submissions_trigger" NOT NULL,
  	"stage" "enum_herocare_submissions_stage" NOT NULL,
  	"device" "enum_herocare_submissions_device",
  	"name" varchar,
  	"postcode" varchar,
  	"company_name" varchar,
  	"number_of_properties" numeric,
  	"phone_number" varchar,
  	"submitted_at" timestamp(3) with time zone,
  	"webhook_status" "enum_herocare_submissions_webhook_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "herocare_forms_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "herocare_submissions_id" integer;
  ALTER TABLE "herocare_forms" ADD CONSTRAINT "herocare_forms_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_submissions" ADD CONSTRAINT "herocare_submissions_tenant_id_tenants_id_fk" FOREIGN KEY ("tenant_id") REFERENCES "public"."tenants"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "herocare_submissions" ADD CONSTRAINT "herocare_submissions_form_id_herocare_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."herocare_forms"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "herocare_forms_tenant_idx" ON "herocare_forms" USING btree ("tenant_id");
  CREATE INDEX "herocare_forms_updated_at_idx" ON "herocare_forms" USING btree ("updated_at");
  CREATE INDEX "herocare_forms_created_at_idx" ON "herocare_forms" USING btree ("created_at");
  CREATE INDEX "herocare_submissions_tenant_idx" ON "herocare_submissions" USING btree ("tenant_id");
  CREATE INDEX "herocare_submissions_form_idx" ON "herocare_submissions" USING btree ("form_id");
  CREATE INDEX "herocare_submissions_updated_at_idx" ON "herocare_submissions" USING btree ("updated_at");
  CREATE INDEX "herocare_submissions_created_at_idx" ON "herocare_submissions" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_forms_fk" FOREIGN KEY ("herocare_forms_id") REFERENCES "public"."herocare_forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_herocare_submissions_fk" FOREIGN KEY ("herocare_submissions_id") REFERENCES "public"."herocare_submissions"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_herocare_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("herocare_forms_id");
  CREATE INDEX "payload_locked_documents_rels_herocare_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("herocare_submissions_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "herocare_forms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "herocare_submissions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "herocare_forms" CASCADE;
  DROP TABLE "herocare_submissions" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_herocare_forms_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_herocare_submissions_fk";
  
  DROP INDEX "payload_locked_documents_rels_herocare_forms_id_idx";
  DROP INDEX "payload_locked_documents_rels_herocare_submissions_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "herocare_forms_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "herocare_submissions_id";
  DROP TYPE "public"."enum_herocare_submissions_journey";
  DROP TYPE "public"."enum_herocare_submissions_trigger";
  DROP TYPE "public"."enum_herocare_submissions_stage";
  DROP TYPE "public"."enum_herocare_submissions_device";
  DROP TYPE "public"."enum_herocare_submissions_webhook_status";`)
}
