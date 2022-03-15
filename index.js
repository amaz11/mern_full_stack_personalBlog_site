const express = require("express");
const cookieParser = require("cookie-parser");
const auth = require("./router/auth");

require("dotenv").config();
require("./db/db");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", auth);

// app.get("/aboutme", (req, res) => {
//   res.send("<h1>aboutme</h1>");
// });

// app.get("/contact", (req, res) => {
//   res.send("<h1>Contact</h1>");
// });

// app.get("/signin", (req, res) => {
//   res.send("<h1>Login</h1>");
// });

// app.get("/signup", (req, res) => {
//   res.send("<h1>Resister</h1>");
// });

app.get("*", (req, res) => {
  res.send("<h1>404 Not Found</h1>");
});

const port = process.env.PORT || 8000;
app.listen(port, (req, res) => {
  console.log("Sever Runing");
});
