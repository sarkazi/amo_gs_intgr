import { Router } from "express";

const router = Router();

import amoWebhookController from "../controllers/amo/webhook.controller";

router.post("/webhook", amoWebhookController);

export default router;
