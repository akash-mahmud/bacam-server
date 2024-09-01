export class CustomError extends Error {
    public code: string;
  
    constructor(msg = "", code = "", ...params: any[]) {
      super(...params);
      Object.setPrototypeOf(this, CustomError.prototype);
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, CustomError);
      }
  
      this.code = code;
      this.message = msg;
    }
  }
  