const express = require("express");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/sellerRequest.controller");
const router = express.Router();

router
  .route("/")
  .get(auth, controller.getAllSellerRequest)
  .post(auth, roleGaurd("SELLER"), controller.createSellerRequest);

module.exports = router;
