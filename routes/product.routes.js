const express = require("express");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/product.controller");
const router = express.Router();

router.route("/").post(auth, roleGaurd("ADMIN"), controller.create);

module.exports = router;
