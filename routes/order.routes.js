const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("./../controllers/order.controller");
const roleGaurd = require("../middlewares/roleGaurd");

const router = express.Router();

router.route("/").get(auth, controller.getAllUserOrder);

router.route("/all").get(auth, roleGaurd("ADMIN"), controller.getAllOrders);
router
  .route("/:orderId")
  .patch(auth, roleGaurd("ADMIN"), controller.updateOrderStatus);

module.exports = router;
