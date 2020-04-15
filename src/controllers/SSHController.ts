import { Request, Response } from 'express';
import { exec } from 'child_process';
import dbRedis from '../config/database/dbRedis';

import { v4 as uuidv4 } from 'uuid';
import * as Yup from 'yup';
import ErrorLib from '../lib/ErrorLib';
import { Client } from 'ssh2';

class SSHController {

  public async store(req: Request, res: Response) {
    const yupSchema = Yup.object().shape({
      name: Yup.string().required(),
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
      id: uuidv4(),
      name: req.body.name,
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
      ssh_config: ssh_config.map((value) => {
        delete value.username;
        delete value.password;
        delete value.port;
        delete value.host;
        delete value.command;
        return value;
      }),
    });
  }

  public async show(req: Request, res: Response) {
    const ssh_config = [...JSON.parse(await dbRedis.getClient().get('ssh_config'))];

    const ssh = ssh_config.find((config: any) => {
      return req.params.id === config.id;
    });

    if (!ssh) {
      throw new ErrorLib({
        errorCode: 3,
        httpCode: 404,
      });
    }

    if (ssh.host === 'localhost') {
      exec(ssh.command);
    } else {
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
    }

    res.json({
      ok: true,
    });
  }

  public async destroy(req: Request, res: Response) {
    let ssh_config = [...JSON.parse(await dbRedis.getClient().get('ssh_config'))];
    ssh_config = ssh_config.filter((config: any) => {
      return !(req.params.id === config.id);
    });

    await dbRedis.getClient().set('ssh_config', JSON.stringify(ssh_config));

    res.json({
      ssh_config,
    });
  }

}

const sSHController = new SSHController();
export default sSHController;
