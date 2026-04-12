import { NextFunction, Request, Response } from "express";
import { DomainError, DomainValidationError } from "../../../domain/shared/errors/domain.errors";

const ErrorStatusMap: Record<string, number> = {
  'InvalidCredentialsError': 401,
  'UserBannedError': 403,
  'DomainValidationError': 400,

  'PasswordMismatchError': 400,
  'EmailAlreadyExistsError': 400,
}

export const errorHandle = (error: any, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = "Lỗi hệ thống máy chủ!";
  let errors = undefined;

  if (error instanceof DomainError) {
    message = error.message;
    statusCode = ErrorStatusMap[error.constructor.name] || 400;

    if (error instanceof DomainValidationError) {
      errors = error.errors;
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};