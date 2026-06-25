import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "emergency_hero_website" ALTER COLUMN "reviews_rating" TYPE varchar USING reviews_rating::text;
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "emergency_hero_website" ALTER COLUMN "reviews_rating" TYPE numeric USING reviews_rating::numeric;
  `)
}
