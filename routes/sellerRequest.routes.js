const express = require("express");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/sellerRequest.controller");
const router = express.Router();

router
  .route("/")
  .get(auth, controller.getUserSellerRequest)
  .post(auth, roleGaurd("SELLER"), controller.createSellerRequest);

router
  .route("/:id")
  .delete(auth, roleGaurd("SELLER"), controller.deleteSellerRequest)
  .patch(auth, roleGaurd("ADMIN"), controller.updateSellerRequest);

module.exports = router;
