const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));
app.use("/users", users);
app.use("/posts", posts);

app.get("/getcookies", (req, res) => {
    res.cookie("greet", "namaste");
    res.cookie("madeIn", "India");
    res.send("Sent you some cookies");
});

app.get("/getsignedcookie", (req, res) => {
    res.cookie("made-in", "India", { signed: true });
    res.send("Signed cookie sent");
});

app.get("/verify", (req, res) => {
    console.log(req.signedCookies);
    res.send("Cookies verified");
});

app.get("/greet", (req, res) => {
    let { name = "anonymous" } = req.cookies;
    res.send(`Hi, ${name}`);
});

app.get("/", (req, res) => {
    console.dir(req.cookies);
    res.send("Hi, I am root route");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
