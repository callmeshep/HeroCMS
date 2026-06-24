import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_services" RENAME COLUMN "hero_character_image_id" TO "hero_character_image_desktop_id";
  ALTER TABLE "emergency_hero_services" DROP CONSTRAINT "emergency_hero_services_hero_character_image_id_media_id_fk";
  
  DROP INDEX "emergency_hero_services_hero_character_image_idx";
  ALTER TABLE "emergency_hero_services" ADD COLUMN "hero_character_image_mobile_id" integer;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_hero_character_image_desktop_id_media_id_fk" FOREIGN KEY ("hero_character_image_desktop_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_hero_character_image_mobile_id_media_id_fk" FOREIGN KEY ("hero_character_image_mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "emergency_hero_services_hero_character_image_desktop_idx" ON "emergency_hero_services" USING btree ("hero_character_image_desktop_id");
  CREATE INDEX "emergency_hero_services_hero_character_image_mobile_idx" ON "emergency_hero_services" USING btree ("hero_character_image_mobile_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_services" DROP CONSTRAINT "emergency_hero_services_hero_character_image_desktop_id_media_id_fk";
  
  ALTER TABLE "emergency_hero_services" DROP CONSTRAINT "emergency_hero_services_hero_character_image_mobile_id_media_id_fk";
  
  DROP INDEX "emergency_hero_services_hero_character_image_desktop_idx";
  DROP INDEX "emergency_hero_services_hero_character_image_mobile_idx";
  ALTER TABLE "emergency_hero_services" ADD COLUMN "hero_character_image_id" integer;
  ALTER TABLE "emergency_hero_services" ADD CONSTRAINT "emergency_hero_services_hero_character_image_id_media_id_fk" FOREIGN KEY ("hero_character_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "emergency_hero_services_hero_character_image_idx" ON "emergency_hero_services" USING btree ("hero_character_image_id");
  ALTER TABLE "emergency_hero_services" DROP COLUMN "hero_character_image_desktop_id";
  ALTER TABLE "emergency_hero_services" DROP COLUMN "hero_character_image_mobile_id";`)
}
