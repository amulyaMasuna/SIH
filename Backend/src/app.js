const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const app = express();
const authRouter = require("./routes/auth.routes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (req, res, next) => {
  res.json({ status: "OK" });
})

app.use("/auth", authRouter);

module.exports = app;