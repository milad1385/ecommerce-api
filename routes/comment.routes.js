const express = require("express");
const controller = require("./../controllers/comment.controller");
const { auth } = require("../middlewares/auth");
const roleGaurd = require("../middlewares/roleGaurd");

const router = express.Router();

router
  .route("/")
  .post(auth, controller.createComment)
  .get(auth, roleGaurd("ADMIN"), controller.getAllComments);

router
  .route("/:id")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteComment)
  .patch(auth, roleGaurd("ADMIN"), controller.acceptOrRejectComment)
  .get(controller.getProductComments);

router.route("/:id/reply").post(auth, controller.createReplyComment);

router
  .route("/:id/reply/:replyId")
  .delete(auth, roleGaurd("ADMIN"), controller.deleteReplyComment)
  .patch(auth, roleGaurd("ADMIN"), controller.updateReplyComment);

module.exports = router;
