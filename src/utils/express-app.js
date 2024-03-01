const cors = require("cors");
const express = require("express");

const AmoRouter = require("#routes/amo.routes.js");
const GoogleRouter = require("#routes/google.routes.js");

module.exports = async (app) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/amo", AmoRouter);
  app.use("/google", GoogleRouter);
};
