const webhookController = require("../controllers/google/webhook.controller.js");
const express = require("express");
const router = express.Router();

router.post("/webhook", webhookController);

module.exports = router;
