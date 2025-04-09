const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const session = require("express-session");

const sessionOptions = {
    secret: "mysupersecretstring",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));

app.get("/register", (req, res) => {
    let { name = "anonymous" } = req.query;
    console.log(req.session);
    res.send(`Hello ${name}, welcome to our website!`);
});

app.get("/hello", (req, res) => {
    res.send(`Hello`);
});

// app.get("/requestcount", (req, res) => {
//     if(req.session.count) {
//         req.session.count++;
//     }
//     else {
//         req.session.count = 1;
//     }
//     res.send(`You sent a request x times ${req.session.count}`);
// });

// app.get("/test", (req, res) => {
//     res.send("Test successful!");
// })

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
