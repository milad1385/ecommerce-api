const express = require("express");
const controller = require("../controllers/user.controller");
const { auth } = require("../middlewares/auth");
const authGaurd = require("../middlewares/authGaurd");
const router = express.Router();

router.route("/ban/:id").post(auth, authGaurd("ADMIN"), controller.ban);
router.route("/:id/address").post(auth, controller.addAddress);

module.exports = router;
