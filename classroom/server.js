const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");



app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
