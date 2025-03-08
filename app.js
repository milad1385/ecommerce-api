const express = require("express");
const app = express();
const path = require("path");
const { setHeaders } = require("./middlewares/setHeaders");
const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const sellerRouter = require("./routes/seller.routes");
const locationRouter = require("./routes/location.routes");
const categoryRouter = require("./routes/category.routes");
const productRouter = require("./routes/product.routes.js");
const noteRouter = require("./routes/note.routes.js");
const sellerRequestRouter = require("./routes/sellerRequest.routes.js");
const commentRouter = require("./routes/comment.routes.js");
const cartRouter = require("./routes/cart.routes.js");
const orderRouter = require("./routes/order.routes.js");
const checkoutRouter = require("./routes/checkout.routes.js");
const swaggerRouter = require("./routes/apiDoc.routes.js");
const errorHandler = require("./middlewares/errorHandler.js");
const { redirectToProduct } = require("./controllers/shortLink.controller.js");

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
app.use("/api/product", productRouter);
app.use("/api/note", noteRouter);
app.use("/api/seller-request", sellerRequestRouter);
app.use("/api/comment", commentRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/checkout", checkoutRouter);
app.get("/p/:shortIdentifier", redirectToProduct);
app.use("/apis", swaggerRouter);

app.use((req, res) => {
  console.log("This path is not found: ", req.path);

  return res.status(404).json({
    message: "404! Path Not Found. Please double check tha path / method",
  });
});

app.use(errorHandler);

module.exports = app;
