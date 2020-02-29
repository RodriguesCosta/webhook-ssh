
interface ErrorInterface {
  message?: string;
  errors?: string[];
  httpCode?: number;
  errorCode: number;
  extraData?: any;
}

class ErrorLib {

  private error: ErrorInterface
  public isErrorLib = true

  public constructor(error: ErrorInterface) {
    this.error = error;
  }

  public getErrorJson() {
    return this.error;
  }

  public getMessage() {
    return this.error.message;
  }

  public getErrors() {
    return this.error.errors || null;
  }

  public getHttpCode() {
    return this.error.httpCode || null;
  }

  public getErrorCode() {
    return this.error.errorCode || null;
  }

};

export default ErrorLib;
