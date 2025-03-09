const controller = require("../controllers/newsLetter.controller");
const express = require("express");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");

const router = express.Router();

router
  .route("/")
  .get(auth, roleGaurd("ADMIN"), controller.getAllNewsLetter)
  .post(controller.createNewsLetter);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteNewsLetter);

module.exports = router;
