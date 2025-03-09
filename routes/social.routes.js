const express = require("express");
const controller = require("../controllers/social.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const { multerStorage } = require("../middlewares/multer");

const upload = multerStorage("public/images/socials");

const router = express.Router();

router
  .route("/")
  .get(controller.getAll)
  .post(
    auth,
    roleGaurd("ADMIN"),
    upload.single("cover"),
    controller.createSocial
  );

router.route("/:id").delete(auth, roleGaurd("ADMIN"), controller.deleteSocial);

module.exports = router;
