const express = require("express");
const controller = require("../controllers/category.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();

const uploader = multerStorage("public/images/category-icon");

router
  .route("/")
  .post(auth, roleGaurd("ADMIN"), uploader.single("icon"), controller.create);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.delete)
  .put(auth, roleGaurd("ADMIN"), controller.update);

module.exports = router;
