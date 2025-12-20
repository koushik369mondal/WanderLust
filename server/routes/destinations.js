const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/destinationController");

router.get("/", destinationController.getDestinations);
router.post("/", destinationController.createDestination); // protect later

module.exports = router;
