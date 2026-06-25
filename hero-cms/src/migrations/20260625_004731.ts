import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_website" RENAME COLUMN "trustpilot_rating" TO "reviews_rating";
  ALTER TABLE "emergency_hero_website" RENAME COLUMN "trustpilot_platforms_label" TO "reviews_platforms_label";
  ALTER TABLE "emergency_hero_website" ADD COLUMN "reviews_stars" numeric;
  ALTER TABLE "emergency_hero_website" DROP COLUMN "trustpilot_review_count";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "emergency_hero_website" ADD COLUMN "trustpilot_rating" numeric;
  ALTER TABLE "emergency_hero_website" ADD COLUMN "trustpilot_review_count" varchar;
  ALTER TABLE "emergency_hero_website" ADD COLUMN "trustpilot_platforms_label" varchar;
  ALTER TABLE "emergency_hero_website" DROP COLUMN "reviews_rating";
  ALTER TABLE "emergency_hero_website" DROP COLUMN "reviews_stars";
  ALTER TABLE "emergency_hero_website" DROP COLUMN "reviews_platforms_label";`)
}
