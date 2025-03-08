const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/wish.controller");
const router = express.Router();

router
  .route("/")
  .get(auth, controller.getAllWishList)
  .post(auth, controller.addToWishList)
  .delete(auth, controller.deleteFromWishList);

module.exports = router;
