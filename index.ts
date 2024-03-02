import express from "express";

import { config } from "dotenv";

config();

import expressApp from "./utils/express-app";
import errorHandler from "./utils/error-handler";

let PORT = process.env.PORT || 3400;

const StartServer = async () => {
  try {
    const app = express();

    await expressApp(app);

    errorHandler(app);

    app
      .listen(PORT, () => {
        console.log(`Express server is running on port ${PORT}`);
      })
      .on("error", (err) => {
        console.log(err);
        process.exit();
      });
  } catch (error) {
    console.log(error, "error");
  }
};

StartServer();
