import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "herocare_website_plans" RENAME COLUMN "stripe_link" TO "stripe_link_high_callout";
  ALTER TABLE "herocare_website_plans" ADD COLUMN "stripe_link_low_callout" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "herocare_website_plans" ADD COLUMN "stripe_link" varchar;
  ALTER TABLE "herocare_website_plans" DROP COLUMN "stripe_link_high_callout";
  ALTER TABLE "herocare_website_plans" DROP COLUMN "stripe_link_low_callout";`)
}
