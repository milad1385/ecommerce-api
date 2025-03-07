const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/checkout.controller");

const router = express.Router();

router.route("/").post(auth, controller.createCheckout);
router.route("/verify").get(controller.verifyCheckout);

module.exports = router;
