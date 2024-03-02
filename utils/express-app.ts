import cors from "cors";
import express, { Express } from "express";

import AmoRouter from "../routes/amo.routes";
import GoogleRouter from "../routes/google.routes";

const expressApp = async (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/amo", AmoRouter);
  app.use("/google", GoogleRouter);
};

export default expressApp;
