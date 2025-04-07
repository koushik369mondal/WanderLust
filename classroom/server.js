const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");

app.use("/users", users);
app.use("/posts", posts)

app.get("/", (req, res) => {
    res.send("Hi, I am root route");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
