const express = require("express");

const router = express.Router();

router.route("/send").post();
router.route("/verify").post();
router.route("/me").get();

module.exports = router;
