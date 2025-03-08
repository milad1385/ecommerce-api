const express = require("express");
const { auth } = require("../middlewares/auth");
const controller = require("../controllers/bookmark.controller");
const router = express.Router();

router
  .route("/")
  .get(auth, controller.getAllBookmarks)
  .post(auth, controller.addToBookmark)
  .delete(auth, controller.deleteFromBookmark);

module.exports = router;
