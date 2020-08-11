const express = require("express");
const msgnrOrcController = require("../controllers/MessengerOrchestratorController");

const router = express.Router();

// routes 
router.get("/webhook", msgnrOrcController.verifyWebhook);
router.post("/webhook", msgnrOrcController.recieveMessage);

// export router module
module.exports = router;