const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // TODO: To be replaced by original authentication with database
  if (username == "ameer" && password == "test") {
    jwt.sign(
      { username: "ameer" },
      process.env.secret || "secret",
      (err, token) => {
        if (!err) {
          res.json({ error: false, token: token });
        } else {
          res.json({ error: err });
        }
      }
    );
  } else {
    res.json({ error: "Invalid username or password" });
  }
});

module.exports = router;
