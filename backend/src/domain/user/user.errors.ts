import { DomainError } from "../shared/errors/domain.errors";

export class MissingCredentialsError extends DomainError {
  constructor(message = 'Vui lòng điền đầy đủ email và mật khẩu') {
    super(message);
  }
}

export class InvalidCredentialsError extends DomainError {
  constructor(message = "Email hoặc mật khẩu không chính xác") {
    super(message);
  }
}

export class UserBannedError extends DomainError {
  constructor(message = "Tài khoản của bạn đã bị khóa") {
    super(message);
  }
}

export class EmailAlreadyExistsError extends DomainError {
  constructor(message = "Email đã tồn tại") {
    super(message);
  }
}

export class PasswordMismatchError extends DomainError {
  constructor(message = "Mật khẩu không khớp") {
    super(message);
  }
}

export class PasswordTooShortError extends DomainError {
  constructor(message = "Mật khẩu tối thiểu 6 ký tự") {
    super(message);
  }
}