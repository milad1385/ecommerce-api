const express = require("express");
const controller = require("../controllers/cart.controller");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.route("/add").post(auth, controller.addToCart);
router.route("/remove").post(auth, controller.removeFromCart);
router.route("/").get(auth, controller.getAllCart);

router.route("/decrease/:itemId").patch(auth, controller.decreaseQty);

module.exports = router;
