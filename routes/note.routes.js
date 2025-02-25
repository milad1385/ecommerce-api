const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/note.controller");
const router = express.Router();

router.route("/").get(auth, controller.getAll).post(auth, controller.create);

router
  .route("/:id")
  .get(auth, controller.getOne)
  .delete(auth, controller.delete)
  .put(auth, controller.update);

module.exports = router;
