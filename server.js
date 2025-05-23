const mongoose = require("mongoose");
const dotenv = require("dotenv");

const isProductionMode = process.env.NODE_ENV === "production";
if (!isProductionMode) {
  dotenv.config();
}
const app = require("./app");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`Error in mongoose connection: ${err}`);
    process.exit(1);
  }
}

async function startServer() {
  const port = +process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(
      `Server is running in ${
        isProductionMode ? "production" : "development"
      } mode on port ${port}`
    );
  });
}

async function run() {
  await connectToDB();
  await startServer();
}

run();
