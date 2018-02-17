// Load configurations
require("dotenv").config();

const app = require("express")();
const passport = require("passport");

module.exports = app;

app.listen(process.env.port || 3000, () => {
  console.log("Express server is up and running...");
  app.emit("listening");
});
