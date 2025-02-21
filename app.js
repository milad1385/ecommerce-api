const express = require("express");
const app = express();
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const sellerRouter = require("./routes/seller.routes");
const locationRouter = require("./routes/location.routes");
const categoryRouter = require("./routes/category.routes");

app.use(express.urlencoded({ extended: false, limit: "30mb" }));
app.use(express.json({ limit: "30mb" }));
app.use(setHeaders);
app.use(express.static(path.join(__dirname, "public")));

//* Routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRouter);
app.use("/api/location", locationRouter);
app.use("/api/category", categoryRouter);

app.use((req, res) => {
  console.log("This path is not found: ", req.path);

  return res.status(404).json({
    message: "404! Path Not Found. Please double check tha path / method",
  });
});

module.exports = app;
