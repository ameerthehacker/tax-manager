// Load configurations
require("dotenv").config();

const app = require("express")();
const bodyParser = require("body-parser");
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
// Routes for the app
const auth = require("./routes/auth");
const houses = require("./routes/houses");

// Authentication with passport and JWT
passport.use(
  new JwtStrategy(
    {
      secretOrKey: "secret",
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    },
    (payload, done) => {
      console.log(payload);
      return done(null, { user: "ameer" });
    }
  )
);

app.use(bodyParser.json());

module.exports = app;

// Routes for the app
app.use("/auth", auth);
app.use("/houses", passport.authenticate("jwt", { session: false }), houses);

app.listen(process.env.port || 3000, () => {
  console.log("Express server is up and running...");
  app.emit("listening");
});
