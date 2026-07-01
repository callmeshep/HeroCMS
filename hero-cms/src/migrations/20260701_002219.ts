import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "yef_website_home_whatever_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer,
  	"label" varchar NOT NULL
  );
  
  ALTER TABLE "yef_website" ADD COLUMN "home_whatever_headline_line1" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_whatever_headline_line2" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_whatever_body" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_whatever_image_id" integer;
  ALTER TABLE "yef_website_home_whatever_services" ADD CONSTRAINT "yef_website_home_whatever_services_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "yef_website_home_whatever_services" ADD CONSTRAINT "yef_website_home_whatever_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."yef_website"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "yef_website_home_whatever_services_order_idx" ON "yef_website_home_whatever_services" USING btree ("_order");
  CREATE INDEX "yef_website_home_whatever_services_parent_id_idx" ON "yef_website_home_whatever_services" USING btree ("_parent_id");
  CREATE INDEX "yef_website_home_whatever_services_icon_idx" ON "yef_website_home_whatever_services" USING btree ("icon_id");
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_home_whatever_image_id_media_id_fk" FOREIGN KEY ("home_whatever_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "yef_website_home_whatever_image_idx" ON "yef_website" USING btree ("home_whatever_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_website_home_whatever_services" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "yef_website_home_whatever_services" CASCADE;
  ALTER TABLE "yef_website" DROP CONSTRAINT "yef_website_home_whatever_image_id_media_id_fk";
  
  DROP INDEX "yef_website_home_whatever_image_idx";
  ALTER TABLE "yef_website" DROP COLUMN "home_whatever_headline_line1";
  ALTER TABLE "yef_website" DROP COLUMN "home_whatever_headline_line2";
  ALTER TABLE "yef_website" DROP COLUMN "home_whatever_body";
  ALTER TABLE "yef_website" DROP COLUMN "home_whatever_image_id";`)
}
