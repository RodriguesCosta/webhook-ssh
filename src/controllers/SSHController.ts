import { Request, Response } from 'express';
import dbRedis from '../config/database/dbRedis';

import uuid from 'uuid';
import * as Yup from 'yup';
import ErrorLib from '../lib/ErrorLib';
import { Client } from 'ssh2';

class SSHController {

  public async store(req: Request, res: Response) {
    const yupSchema = Yup.object().shape({
      host: Yup.string().required(),
      port: Yup.number().required(),
      username: Yup.string().required(),
      password: Yup.string().required(),
      command: Yup.string().required(),
    });

    if (!await yupSchema.isValid(req.body)) {
      throw new ErrorLib({
        errorCode: 2,
      });
    }

    const ssh_config = [...JSON.parse(await dbRedis.getClient().get('ssh_config'))];
    const ssh = {
      id: uuid.v4(),
      host: req.body.host,
      port: req.body.port,
      username: req.body.username,
      password: req.body.password,
      command: req.body.command,
    };
    ssh_config.push(ssh);

    await dbRedis.getClient().set('ssh_config', JSON.stringify(ssh_config));

    res.json({
      ssh,
    });
  }

  public async index(req: Request, res: Response) {
    const ssh_config = [...JSON.parse(await dbRedis.getClient().get('ssh_config'))];
    res.json({
      ssh_config,
    });
  }

  public async show(req: Request, res: Response) {
    const ssh_config = [...JSON.parse(await dbRedis.getClient().get('ssh_config'))];

    const ssh = ssh_config.find((config: any) => {
      return req.params.id === config.id;
    });

    const conn = new Client();
    conn.on('ready', () => {
      conn.shell((err, stream) => {
        if (err) throw err;
        stream.on('close', () => {
          conn.end();
        });
        stream.end(`${ssh.command} && exit\n`);
      });
    }).connect({
      host: ssh.host,
      port: ssh.port,
      username: ssh.username,
      password: ssh.password,
    });

    res.json({
      ok: true,
    });
  }

}

const sSHController = new SSHController();
export default sSHController;
