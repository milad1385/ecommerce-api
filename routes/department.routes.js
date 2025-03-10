const express = require("express");
const controller = require("../controllers/department.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");
const router = express.Router();

router
  .route("/")
  .get(controller.getAllDepartment)
  .post(auth, roleGaurd("ADMIN"), controller.createDepartment);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteDepartment)
  .put(auth, roleGaurd("ADMIN"), controller.updateDepartment);

router.route("/:id/sub").get(controller.getAllSubDepartment);

router.route("/sub").post(controller.createSubDepartment);

module.exports = router;
