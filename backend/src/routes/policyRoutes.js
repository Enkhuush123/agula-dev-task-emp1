const express = require("express");
const router = express.Router();
const policyController = require("../controllers/policyController");

router.post("/", policyController.createPolicy);
router.get("/", policyController.getAllPolicies);
router.get("/:id", policyController.getPolicyById);
router.patch("/:id/cancel", policyController.cancelPolicy);

module.exports = router;
