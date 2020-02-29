"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./environment");
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const https_1 = require("https");
const validator_1 = __importDefault(require("validator"));
// @ts-ignore
const youch_1 = __importDefault(require("youch"));
require("express-async-errors");
class ExpressServer {
    constructor() {
        this.server = express_1.default();
        this.http = new http_1.Server(this.server);
        this.https = https_1.createServer({
            key: environment_1.envServer.privkey,
            cert: environment_1.envServer.fullchain,
        }, this.server);
        this.server.set('trust proxy', false);
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.server.use(helmet_1.default());
        this.server.use(express_1.default.json());
        this.server.use(cors_1.default());
        this.server.use((req, res, next) => {
            if (!validator_1.default.isIP(req.get('host').split(':')[0]) || environment_1.envIsDev() || environment_1.envIsTest()) {
                next();
            }
            else {
                res.status(403).end();
            }
        });
        this.server.use((req, res, next) => {
            if (req.ips.length > 1 && !environment_1.envIsDev() && !environment_1.envIsTest()) {
                res.status(403).end();
            }
            else {
                next();
            }
        });
        this.server.use((req, res, next) => {
            if (req.secure || environment_1.envIsDev() || environment_1.envIsTest()) {
                next();
            }
            else {
                res.redirect(`https://${req.get('host')}${req.url}`);
            }
        });
    }
    routes() {
        this.server.get('/robots.txt', (req, res) => {
            res.type('text/plain');
            res.send('User-agent: *\nDisallow: /');
        });
    }
    exceptionHandler() {
        this.server.use((err, req, res, next) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const possibleErrorLib = err;
            if (possibleErrorLib.isErrorLib) {
                res.status(possibleErrorLib.getHttpCode() || 422).json(possibleErrorLib.getErrorJson());
                return;
            }
            const errors = yield new youch_1.default(err, req).toJSON();
            if (!environment_1.envIsDev() && !environment_1.envIsTest())
                delete errors.error.frames;
            res.status(500).json(errors);
            return;
        }));
    }
    initServer() {
        this.exceptionHandler();
        this.http.listen(environment_1.envServer.portHttp, () => {
            console.log(`HTTP: start port ${environment_1.envServer.portHttp}`);
        });
        if (!environment_1.envIsDev() && !environment_1.envIsTest())
            this.https.listen(environment_1.envServer.portHttps, () => {
                console.log(`HTTPS: start port ${environment_1.envServer.portHttps}`);
            });
    }
    closeServer() {
        this.http.close();
        if (!environment_1.envIsDev() && !environment_1.envIsTest())
            this.https.close();
    }
    applyRoute(routePath, route) {
        this.server.use(routePath, route);
    }
}
;
const server = new ExpressServer();
exports.default = server;
//# sourceMappingURL=server.js.map