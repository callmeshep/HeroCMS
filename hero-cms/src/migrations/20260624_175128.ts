import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_website" ADD COLUMN "home_modal_headline" varchar;
  ALTER TABLE "emergency_hero_website" ADD COLUMN "home_modal_character_image_id" integer;
  ALTER TABLE "emergency_hero_website" ADD CONSTRAINT "emergency_hero_website_home_modal_character_image_id_emergency_hero_image_gallery_id_fk" FOREIGN KEY ("home_modal_character_image_id") REFERENCES "public"."emergency_hero_image_gallery"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "emergency_hero_website_home_modal_character_image_idx" ON "emergency_hero_website" USING btree ("home_modal_character_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_website" DROP CONSTRAINT "emergency_hero_website_home_modal_character_image_id_emergency_hero_image_gallery_id_fk";
  
  DROP INDEX "emergency_hero_website_home_modal_character_image_idx";
  ALTER TABLE "emergency_hero_website" DROP COLUMN "home_modal_headline";
  ALTER TABLE "emergency_hero_website" DROP COLUMN "home_modal_character_image_id";`)
}
