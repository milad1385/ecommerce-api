const express = require("express");
const roleGaurd = require("../middlewares/roleGaurd");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/seller.controller");
const router = express.Router();

router
  .route("/")
  .post(auth, roleGaurd("SELLER"), controller.create)
  .delete(auth, roleGaurd("SELLER"), controller.delete)
  .patch(auth, roleGaurd("SELLER"), controller.update)
  .get(auth, roleGaurd("SELLER"), controller.get);

module.exports = router;
