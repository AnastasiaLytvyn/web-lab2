export class ApiError extends Error {
  constructor(message = "", status = 400) {
    super(message);
    this.status = status;
  }

  static RateLimitError() {
    return new ApiError("Too many requests", 429);
  }

  static ValidationError(desc) {
    return new ApiError("Validation Error: " + desc, 400);
  }
}
