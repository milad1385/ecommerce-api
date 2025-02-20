const express = require("express");
const controller = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const router = express.Router();

router.route("/ban/:id").post(auth, roleGaurd("ADMIN"), controller.ban);
router
  .route("/:id/address")
  .post(auth, controller.addAddress)
  .delete(auth, controller.delete)
  .patch(auth, controller.update);

router.route("/").get(auth, roleGaurd("ADMIN"), controller.getAll);

module.exports = router;
