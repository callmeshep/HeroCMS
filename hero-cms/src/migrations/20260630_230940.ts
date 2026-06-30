import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_website" ADD COLUMN "hero_headline_underline_s_v_g_id" integer;
  ALTER TABLE "yef_website" ADD CONSTRAINT "yef_website_hero_headline_underline_s_v_g_id_media_id_fk" FOREIGN KEY ("hero_headline_underline_s_v_g_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "yef_website_hero_headline_underline_s_v_g_idx" ON "yef_website" USING btree ("hero_headline_underline_s_v_g_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_website" DROP CONSTRAINT "yef_website_hero_headline_underline_s_v_g_id_media_id_fk";
  
  DROP INDEX "yef_website_hero_headline_underline_s_v_g_idx";
  ALTER TABLE "yef_website" DROP COLUMN "hero_headline_underline_s_v_g_id";`)
}
