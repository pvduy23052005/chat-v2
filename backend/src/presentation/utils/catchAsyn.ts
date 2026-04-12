import { Request, Response, NextFunction } from "express";

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {

    const result = fn(req, res, next);

    const promise = Promise.resolve(result);

    promise.catch((error) => {
      next(error)
    });
  }
}