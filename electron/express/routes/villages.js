const express = require("express");
const router = express.Router();
const Villages = require("../models/Village");

router.get("/", (req, res) => {
  const db = req.app.get("db");
  Villages.getAllVillages(db)
    .then(villages => {
      res.send({ err: false, villages });
    })
    .catch(err => {
      res.json({ err });
    });
});

module.exports = router;
