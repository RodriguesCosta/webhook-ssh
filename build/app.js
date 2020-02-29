"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("./bootstrap");
const server_1 = __importDefault(require("./config/server"));
const Routes_1 = __importDefault(require("./routes/Routes"));
server_1.default.applyRoute('/', Routes_1.default);
server_1.default.initServer();
//# sourceMappingURL=app.js.map