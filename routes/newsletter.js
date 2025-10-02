const express = require("express");
const router = express.Router();
const newsletterController = require("../controllers/newsletter.js");
const { isLoggedIn } = require("../middleware.js");

// Subscribe to newsletter
router.post("/subscribe", newsletterController.subscribe);

// Unsubscribe from newsletter
router.post("/unsubscribe", newsletterController.unsubscribe);

// Newsletter management page
router.get("/", (req, res) => {
    res.render("newsletter", { title: "Newsletter" });
});

// Get newsletter statistics (admin only)
router.get("/stats", isLoggedIn, newsletterController.getStats);

module.exports = router;