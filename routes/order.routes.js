const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("./../controllers/order.controller");

const router = express.Router();

router.route("/").get(auth, controller.getAllUserOrder);
router.route("/:orderId").patch(auth, controller.updateOrderStatus);

module.exports = router;
