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
const bookmarkRouter = require("./routes/bookmark.routes.js");
const wishListRouter = require("./routes/wish.routes.js");
const socialRouter = require("./routes/social.routes.js");
const newsLetterRouter = require("./routes/newsLetter.routes.js");
const departmentRouter = require("./routes/department.routes.js");
const contactRouter = require("./routes/contactus.routes.js");
const ticketRouter = require("./routes/ticket.routes.js");
const articleRouter = require("./routes/article.routes.js");
const articleCategoryRouter = require("./routes/articleCategory.routes.js");
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
app.use("/api/bookmark", bookmarkRouter);
app.use("/api/wish", wishListRouter);
app.use("/api/social", socialRouter);
app.use("/api/newsLetter", newsLetterRouter);
app.use("/api/department", departmentRouter);
app.use("/api/contact", contactRouter);
app.use("/api/ticket", ticketRouter);
app.use("/api/article", articleRouter);
app.use("/api/article-category", articleCategoryRouter);
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
