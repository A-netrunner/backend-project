class ApiError extends Error {
  constructor(
    statusCode = statusCode,
    message = "Internal Server Error",
    errors = [],
    stack = ""
    
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.message = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export {ApiError}