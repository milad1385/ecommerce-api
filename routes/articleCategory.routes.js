const express = require("express");
const controller = require("../controllers/articleCategory.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();

const uploader = multerStorage("public/images/articleCategory");

router
  .route("/")
  .get(controller.getAllArticlesCategory)
  .post(
    auth,
    roleGaurd("ADMIN"),
    uploader.single("pic"),
    controller.createArticleCategory
  );

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteArticleCategory)
  .put(auth, roleGaurd("ADMIN"), controller.updateArticleCategory);

module.exports = router;
