import * as migration_20260508_182823 from './20260508_182823';
import * as migration_20260510_214014 from './20260510_214014';
import * as migration_20260520_154420_add_worth_noting_to_feature_rows from './20260520_154420_add_worth_noting_to_feature_rows';
import * as migration_20260611_231951_add_form_notification_fields from './20260611_231951_add_form_notification_fields';
import * as migration_20260611_233343_add_submission_email_field from './20260611_233343_add_submission_email_field';
import * as migration_20260611_234546_add_integrations_fields from './20260611_234546_add_integrations_fields';
import * as migration_20260616_191501 from './20260616_191501';
import * as migration_20260617_204251 from './20260617_204251';
import * as migration_20260624_135244 from './20260624_135244';
import * as migration_20260624_175128 from './20260624_175128';
import * as migration_20260624_183453 from './20260624_183453';
import * as migration_20260624_214003 from './20260624_214003';
import * as migration_20260624_220020 from './20260624_220020';

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
    name: '20260611_233343_add_submission_email_field',
  },
  {
    up: migration_20260611_234546_add_integrations_fields.up,
    down: migration_20260611_234546_add_integrations_fields.down,
    name: '20260611_234546_add_integrations_fields',
  },
  {
    up: migration_20260616_191501.up,
    down: migration_20260616_191501.down,
    name: '20260616_191501',
  },
  {
    up: migration_20260617_204251.up,
    down: migration_20260617_204251.down,
    name: '20260617_204251',
  },
  {
    up: migration_20260624_135244.up,
    down: migration_20260624_135244.down,
    name: '20260624_135244',
  },
  {
    up: migration_20260624_175128.up,
    down: migration_20260624_175128.down,
    name: '20260624_175128',
  },
  {
    up: migration_20260624_183453.up,
    down: migration_20260624_183453.down,
    name: '20260624_183453',
  },
  {
    up: migration_20260624_214003.up,
    down: migration_20260624_214003.down,
    name: '20260624_214003',
  },
  {
    up: migration_20260624_220020.up,
    down: migration_20260624_220020.down,
    name: '20260624_220020'
  },
];
