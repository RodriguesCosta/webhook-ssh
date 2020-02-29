import { envServer, envIsDev, envIsTest, envAppName } from './environment';

import express, { NextFunction, Response, Request, ErrorRequestHandler } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { Server } from 'http';
import { createServer } from 'https';
import validator from 'validator';

// @ts-ignore
import Youch from 'youch';
import 'express-async-errors';
import ErrorLib from '../lib/ErrorLib';

class ExpressServer {

  private server: express.Express
  private http: Server
  private https: Server

  public constructor() {
    this.server = express();
    this.http = new Server(this.server);
    this.https = createServer({
      key: envServer.privkey,
      cert: envServer.fullchain,
    }, this.server);

    this.server.set('trust proxy', false);

    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.server.use(helmet());

    this.server.use(express.json());

    this.server.use(cors());

    this.server.use((req, res, next) => {
      if (!validator.isIP(req.get('host').split(':')[0]) || envIsDev() || envIsTest()) {
        next();
      } else {
        res.status(403).end();
      }
    });

    this.server.use((req, res, next) => {
      if (req.ips.length > 1 && !envIsDev() && !envIsTest()) {
        res.status(403).end();
      } else {
        next();
      }
    });

    this.server.use((req, res, next) => {
      if (req.secure || envIsDev() || envIsTest()) {
        next();
      } else {
        res.redirect(`https://${req.get('host')}${req.url}`);
      }
    });
  }

  private routes() {
    this.server.get('/', (req, res) => {
      res.type('text/plain');
      res.send(envAppName);
    });

    this.server.get('/robots.txt', (req, res) => {
      res.type('text/plain');
      res.send('User-agent: *\nDisallow: /');
    });
  }

  private exceptionHandler() {
    this.server.use(async (err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
      // @ts-ignore
      const possibleErrorLib: ErrorLib = err;
      if (possibleErrorLib.isErrorLib) {
        res.status(possibleErrorLib.getHttpCode() || 422).json(possibleErrorLib.getErrorJson());
        return;
      }

      const errors = await new Youch(err, req).toJSON();

      if (!envIsDev() && !envIsTest())
        delete errors.error.frames;

      res.status(500).json(errors);
      return;
    });
  }

  public initServer() {
    this.exceptionHandler();

    this.http.listen(envServer.portHttp, () => {
      console.log(`HTTP: start port ${envServer.portHttp}`);
    });

    if (!envIsDev() && !envIsTest())
      this.https.listen(envServer.portHttps, () => {
        console.log(`HTTPS: start port ${envServer.portHttps}`);
      });
  }

  public closeServer() {
    this.http.close();

    if (!envIsDev() && !envIsTest())
      this.https.close();
  }

  public applyRoute(routePath: string, route: express.Router) {
    this.server.use(routePath, route);
  }
};

const server = new ExpressServer();
export default server;
