import * as migration_20260508_182823 from './20260508_182823';
import * as migration_20260510_214014 from './20260510_214014';
import * as migration_20260520_154420_add_worth_noting_to_feature_rows from './20260520_154420_add_worth_noting_to_feature_rows';
import * as migration_20260611_231951_add_form_notification_fields from './20260611_231951_add_form_notification_fields';
import * as migration_20260611_233343_add_submission_email_field from './20260611_233343_add_submission_email_field';

export const migrations = [
  {
    up: migration_20260508_182823.up,
    down: migration_20260508_182823.down,
    name: '20260508_182823',
  },
  {
    up: migration_20260510_214014.up,
    down: migration_20260510_214014.down,
    name: '20260510_214014',
  },
  {
    up: migration_20260520_154420_add_worth_noting_to_feature_rows.up,
    down: migration_20260520_154420_add_worth_noting_to_feature_rows.down,
    name: '20260520_154420_add_worth_noting_to_feature_rows',
  },
  {
    up: migration_20260611_231951_add_form_notification_fields.up,
    down: migration_20260611_231951_add_form_notification_fields.down,
    name: '20260611_231951_add_form_notification_fields',
  },
  {
    up: migration_20260611_233343_add_submission_email_field.up,
    down: migration_20260611_233343_add_submission_email_field.down,
    name: '20260611_233343_add_submission_email_field'
  },
];
