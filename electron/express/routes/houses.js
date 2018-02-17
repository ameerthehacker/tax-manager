const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({ msg: "TODO:// Things are yet to be done" });
});

module.exports = router;
