const express = require("express");
const swaggerUi = require("swagger-ui-express");
const router = express.Router();

const swaggerDoc = require("../swagger/swagger.json");

const swaggerOptions = {
  customCss: ``,
};

router.use("/", swaggerUi.serve);
router.use("/", swaggerUi.setup(swaggerDoc, swaggerOptions));

module.exports = router;
