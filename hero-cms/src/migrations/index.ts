import * as migration_20260508_182823 from './20260508_182823';
import * as migration_20260510_214014 from './20260510_214014';

export const migrations = [
  {
    up: migration_20260508_182823.up,
    down: migration_20260508_182823.down,
    name: '20260508_182823',
  },
  {
    up: migration_20260510_214014.up,
    down: migration_20260510_214014.down,
    name: '20260510_214014'
  },
];
