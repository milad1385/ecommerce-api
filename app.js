const express = require("express");
const app = express();
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders");
const authRouter = require("./routes/auth.routes");

app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use(express.json({ limit: "30mb" }));
app.use(setHeaders);
app.use(express.static(path.join(__dirname, "public")));

//* Routers
app.use("/api/auth", authRouter);

app.use((req, res) => {
  console.log("This path is not found: ", req.path);

  return res.status(404).json({
    message: "404! Path Not Found. Please double check tha path / method",
  });
});

module.exports = app;
