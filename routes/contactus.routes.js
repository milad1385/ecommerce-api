const express = require("express");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const controller = require("../controllers/contact.controller");
const router = express.Router();

router
  .route("/")
  .get(auth, roleGaurd("ADMIN"), controller.getAllContacts)
  .post(controller.createContact);

router
  .route("/:id")
  .put(auth, roleGaurd("ADMIN"), controller.updateContact)
  .delete(auth, roleGaurd("ADMIN"), controller.deleteContact);

module.exports = router;
