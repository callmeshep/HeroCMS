import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_website" ADD COLUMN "home_hero_headline_line1" varchar;
  ALTER TABLE "yef_website" ADD COLUMN "home_hero_headline_line2" varchar;
  ALTER TABLE "yef_website" DROP COLUMN "home_hero_headline";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "yef_website" ADD COLUMN "home_hero_headline" varchar;
  ALTER TABLE "yef_website" DROP COLUMN "home_hero_headline_line1";
  ALTER TABLE "yef_website" DROP COLUMN "home_hero_headline_line2";`)
}
