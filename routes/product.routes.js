const express = require("express");
const { auth } = require("../middlewares/auth");
const { multerStorage } = require("../middlewares/multer");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/product.controller");
const { loggedIn } = require("../middlewares/LoggedIn");
const router = express.Router();

const upload = multerStorage("public/images/products");

router
  .route("/")
  .post(
    auth,
    roleGaurd("ADMIN"),
    upload.array("images", 10),
    controller.create
  );

router.route("/all").get(loggedIn, controller.getAll);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.delete)
  .get(controller.getOne)
  .put(auth, roleGaurd("ADMIN"), upload.array("images", 10), controller.update);

module.exports = router;
