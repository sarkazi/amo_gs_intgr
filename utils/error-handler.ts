import { Request, Express, Response, NextFunction } from "express";

const errorHandler = (app: Express) => {
  app.use(async (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err, "err");

    const defineStatusCode = () => {
      if (err.hasOwnProperty("code")) {
        return err.code;
      } else if (err.hasOwnProperty("statusCode")) {
        return err.statusCode;
      } else if (
        err.hasOwnProperty("data") &&
        err.data.hasOwnProperty("code")
      ) {
        return err.data.code;
      } else if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("code")
      ) {
        return err.response.code;
      } else if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("data") &&
        err.response.data.hasOwnProperty("code")
      ) {
        return err.response.data.code;
      } else {
        return 500;
      }
    };

    const defineErrorData = () => {
      if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("data") &&
        err.response.data.hasOwnProperty("error")
      ) {
        return err.response.data.error;
      } else if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("error")
      ) {
        return err.response.error;
      } else if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("data") &&
        err.response.data.hasOwnProperty("err")
      ) {
        return err.response.data.err;
      } else if (
        err.hasOwnProperty("response") &&
        err.response.hasOwnProperty("data") &&
        err.response.data.hasOwnProperty("message")
      ) {
        return err.response.data.message;
      } else if (err.hasOwnProperty("message")) {
        return err.message;
      } else {
        return err;
      }
    };

    const statusCode = defineStatusCode();

    const errorData = defineErrorData();

    const headersSent = res.headersSent;

    const responseData = {
      code: statusCode,
      errorData: errorData,
    };

    if (!headersSent) {
      return res.status(200).json(responseData);
    }
  });
};

export default errorHandler;
