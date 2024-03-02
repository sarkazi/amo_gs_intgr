import { Router } from "express";

const router = Router();

import googleWebhookController from "../controllers/google/webhook.controller";

router.post("/webhook", googleWebhookController);

export default router;
