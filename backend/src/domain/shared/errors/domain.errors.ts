export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class DomainValidationError extends DomainError {
  public readonly errors: Record<string, string>;

  constructor(errors: Record<string, string>, message = 'Dữ liệu đầu vào không hợp lệ') {
    super(message);
    this.errors = errors;
  }
}