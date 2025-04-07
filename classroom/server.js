const express = require("express");
const app = express();
const users = require("./routes/user.js");

app.use("/users", users);

app.get("/", (req, res) => {
    res.send("Hi, I am root route");
});


//POST
//Index
app.get("/posts", (req, res) => {
    res.send("Hi, I am posts route");
});

//Show 
app.get("/posts/:id", (req, res) => {
    res.send(`GET for show posts id`);
});

//POST 
app.post("/posts", (req, res) => {
    res.send("POST for posts");
})

//DELETE 
app.delete("/posts/:id", (req, res) => {
    res.send(`DELETE for posts id`);
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
