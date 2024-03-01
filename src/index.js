const express = require("express");
require("dotenv").config();

const expressApp = require("#utils/express-app.js");
const errorHandler = require("#utils/error-handler.js");

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
      })
      .on("close", () => {
        channel.close();
      });
  } catch (error) {
    console.log(error, "error");
  }
};

StartServer();
