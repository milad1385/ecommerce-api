const express = require("express");
const { auth } = require("../middlewares/auth");
const { multerStorage } = require("../middlewares/multer");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/product.controller");
const router = express.Router();

const uploader = multerStorage("public/images/product");

router
  .route("/")
  .post(
    auth,
    roleGaurd("ADMIN"),
    uploader.array("images", 10),
    controller.create
  );

module.exports = router;
