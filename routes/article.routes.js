const express = require("express");
const controller = require("../controllers/article.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();
const uploader = multerStorage("public/images/articles");

router
  .route("/")
  .get(controller.getAllPublishedArticles)
  .post(
    auth,
    roleGaurd("ADMIN"),
    uploader.single("cover"),
    controller.createArticle
  );

router.route("/all").get(auth, roleGaurd("ADMIN"), controller.getAllArticles);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteArticle)
  .put(auth, roleGaurd("ADMIN"), controller.updateArticle)
  .patch(auth, roleGaurd("ADMIN"), controller.changeArticleStatus);

router.route("/:shortName").get(controller.getArticle);

router.route("/category/:shortName").get(controller.getArticlesByCategory);

module.exports = router;
