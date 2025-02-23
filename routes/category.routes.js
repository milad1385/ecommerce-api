const express = require("express");
const categoryController = require("../controllers/category.controller");
const subCategoryController = require("../controllers/subCategory.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const { multerStorage } = require("../middlewares/multer");

const router = express.Router();

const uploader = multerStorage("public/images/category-icon");

router
  .route("/")
  .post(
    auth,
    roleGaurd("ADMIN"),
    uploader.single("icon"),
    categoryController.create
  );

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), categoryController.delete)
  .put(auth, roleGaurd("ADMIN"), categoryController.update);

router.route("/").get(categoryController.fetchAll);

router
  .route("/sub")
  .post(auth, roleGaurd("ADMIN"), subCategoryController.create)
  .get(subCategoryController.getAll);

router
  .route("/sub/:id")
  .delete(auth, roleGaurd("ADMIN"), subCategoryController.delete)
  .put(auth, roleGaurd("ADMIN"), subCategoryController.update);
module.exports = router;
