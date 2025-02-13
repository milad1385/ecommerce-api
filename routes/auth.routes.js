const express = require("express");
const { me, send, verify } = require("../controllers/auth.controller");

const router = express.Router();

router.route("/send").post(send);
router.route("/verify").post(verify);
router.route("/me").get(me);

module.exports = router;
