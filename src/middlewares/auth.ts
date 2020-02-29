import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import base64 from 'js-base64';
const { Base64 } = base64;

import dbRedis from '../config/database/dbRedis';
import ErrorLib from 'lib/ErrorLib';

export default async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ErrorLib({
      errorCode: 1,
    });
  }

  const [, token] = authHeader.split(' ');
  const [user, pass] = Base64.decode(token).split(':');

  const [defaultUser, defaultPass] = await Promise.all([
    dbRedis.getClient().get('user_user'),
    dbRedis.getClient().get('user_pass'),
  ]);


  if (user != defaultUser || !bcrypt.compareSync(pass, defaultPass)) {
    throw new ErrorLib({
      errorCode: 1,
    });
  }

  next();
};
