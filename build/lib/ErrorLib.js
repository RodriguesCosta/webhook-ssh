"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ErrorLib {
    constructor(error) {
        this.isErrorLib = true;
        this.error = error;
    }
    getErrorJson() {
        return this.error;
    }
    getMessage() {
        return this.error.message;
    }
    getErrors() {
        return this.error.errors || null;
    }
    getHttpCode() {
        return this.error.httpCode || null;
    }
    getErrorCode() {
        return this.error.errorCode || null;
    }
}
;
exports.default = ErrorLib;
//# sourceMappingURL=ErrorLib.js.map