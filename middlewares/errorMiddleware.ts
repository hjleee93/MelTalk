import { Request, Response, NextFunction } from 'express';
export const errorMiddleware = (
  err: any, 
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
};
