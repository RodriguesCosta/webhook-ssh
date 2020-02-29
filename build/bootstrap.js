"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
dotenv_1.config({
    path: process.env.NODE_ENV == 'test' ? '.env.test' : '.env',
});
require("./config/sentry");
//# sourceMappingURL=bootstrap.js.map