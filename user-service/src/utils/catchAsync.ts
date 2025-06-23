import { Request, Response, NextFunction } from "express";
type ReturnType = {
  data?: object;
  token?: string;
  message?: string;
  statusCode: number;
};

const catchAsync =
  (controller: (req: Request, res: Response, next: NextFunction) => any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: ReturnType = await controller(req, res, next);

      const response: any = { success: true };

      if (data !== undefined) response.data = data.data;
      if (data.token !== undefined) response.token = data.token;
      if (data.message !== undefined) response.message = data.message;

      res.status(data.statusCode).json(response);
    } catch (err) {
      next(err);
    }
  };

export default catchAsync;
