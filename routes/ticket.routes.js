const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/ticket.controller");
const roleGaurd = require("../middlewares/roleGaurd");

const router = express.Router();

router
  .route("/")
  .get(auth, controller.getAllUserTickets)
  .post(auth, controller.createTicket);

router.route("/all").get(auth, roleGaurd("ADMIN"), controller.getAllTickets);

router
  .route("/:id/answer")
  .put(auth, roleGaurd("ADMIN"), controller.sendAnswerToTicket);

router
  .route("/:id")
  .patch(auth, roleGaurd("ADMIN"), controller.changeTicketStatus)
  .delete(auth, roleGaurd("ADMIN"), controller.deleteTicket);

module.exports = router;
