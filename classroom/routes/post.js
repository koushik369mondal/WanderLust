const express = require("express");
const router = express.Router();

//POST
//Index
router.get("/", (req, res) => {
    res.send("Hi, I am posts route");
});

//Show
router.get("/:id", (req, res) => {
    res.send(`GET for show posts id`);
});

//POST
router.post("/", (req, res) => {
    res.send("POST for posts");
});

//DELETE
router.delete("/:id", (req, res) => {
    res.send(`DELETE for posts id`);
});

module.exports = router;
