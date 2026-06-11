import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "herocare_forms_notification_recipients" (
  "_order" integer NOT NULL,
  "_parent_id" integer NOT NULL,
  "id" varchar PRIMARY KEY NOT NULL,
  "email" varchar NOT NULL
  );
  
  ALTER TABLE "herocare_forms" ADD COLUMN "notifications_enabled" boolean DEFAULT true;
  ALTER TABLE "herocare_forms_notification_recipients" ADD CONSTRAINT "herocare_forms_notification_recipients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."herocare_forms"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "herocare_forms_notification_recipients_order_idx" ON "herocare_forms_notification_recipients" USING btree ("_order");
  CREATE INDEX "herocare_forms_notification_recipients_parent_id_idx" ON "herocare_forms_notification_recipients" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "herocare_forms_notification_recipients" CASCADE;
  ALTER TABLE "herocare_forms" DROP COLUMN "notifications_enabled";`)
}
