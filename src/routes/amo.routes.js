const express = require("express");
const router = express.Router();

const webhookController = require("#controllers/amo/webhook.controller.js");

router.post("/webhook", webhookController);

module.exports = router;
