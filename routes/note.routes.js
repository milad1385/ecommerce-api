const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/note.controller");
const router = express.Router();

router.route("/").get(auth, controller.getAll).post(auth, controller.create);

module.exports = router;
