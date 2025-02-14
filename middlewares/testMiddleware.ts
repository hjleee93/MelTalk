import { Request, Response, NextFunction } from 'express';

export const testMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.query.test === '123') {
      next();
    } else {
      throw { error_code: 400, error_msg: 'Invalid request' };
    }
  } catch (error: any) {
    res.status(error.error_code || 400).json({
      error: error.error_msg || 'An error occurred',
    });
  }
};
