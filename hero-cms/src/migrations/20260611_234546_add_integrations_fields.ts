import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_api_keys_scripts_placement" AS ENUM('head', 'body-start', 'body-end');
  CREATE TABLE "api_keys_scripts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"placement" "enum_api_keys_scripts_placement" DEFAULT 'head' NOT NULL,
  	"code" varchar NOT NULL,
  	"enabled" boolean DEFAULT true
  );
  
  ALTER TABLE "api_keys" ADD COLUMN "ga4_measurement_id" varchar;
  ALTER TABLE "api_keys" ADD COLUMN "gtm_container_id" varchar;
  ALTER TABLE "api_keys_scripts" ADD CONSTRAINT "api_keys_scripts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "api_keys_scripts_order_idx" ON "api_keys_scripts" USING btree ("_order");
  CREATE INDEX "api_keys_scripts_parent_id_idx" ON "api_keys_scripts" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "api_keys_scripts" CASCADE;
  ALTER TABLE "api_keys" DROP COLUMN "ga4_measurement_id";
  ALTER TABLE "api_keys" DROP COLUMN "gtm_container_id";
  DROP TYPE "public"."enum_api_keys_scripts_placement";`)
}
