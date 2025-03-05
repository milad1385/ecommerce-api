const express = require("express");
const controller = require("../controllers/cart.controller");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.route("/add").post(auth, controller.addToCart);
router.route("/remove").post(auth, controller.remove);
router.route("/").get(auth, controller.getAllCarts);

module.exports = router;
