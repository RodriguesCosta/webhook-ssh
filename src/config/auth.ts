import dbRedis from './database/dbRedis';
import bcrypt from 'bcryptjs';
import { envAuth } from './environment';

(async function () {
  const userCreated = await dbRedis.getClient().get('user_created');
  if (!userCreated) {
    dbRedis.getClient().set('user_user', envAuth.defaultUser);
    dbRedis.getClient().set('user_pass', bcrypt.hashSync(envAuth.defaultPass, bcrypt.genSaltSync()));
    dbRedis.getClient().set('user_created', 'true');
  }

  const configCreated = await dbRedis.getClient().get('ssh_config');
  if (!configCreated) {
    dbRedis.getClient().set('ssh_config', JSON.stringify([]));
  }
})();
