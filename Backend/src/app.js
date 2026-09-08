const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");
const labelRouter = require("./routes/label.routes");

const allowedOrigins = [
  "'http://localhost:5173",
  `${process.env.FRONTEND_URL}`
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ 
  // origin: function(origin, callback) {
  //   if(!origin) return callback(null, true);

  //   if(allowedOrigins.indexOf(origin) == -1) {
  //     return callback(new Error("The CORS policy for this site does not allow access from the specified Origin."), false);
  //   }

  //   return callback(null, true);
  // },
  origin: "http://localhost:5173",
  credentials: true,
}));

app.get("/health", (req, res, next) => {
  res.json({ status: "OK" });
})

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);
app.use("/label", labelRouter);

module.exports = app;