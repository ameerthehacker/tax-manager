const express = require("express");
const router = express.Router();

const Tax = require("../models/Tax");

router.post("/", (req, res) => {
  const db = req.app.get("db");
  const taxName = req.body.taxName;

  Tax.addTax(db, taxName)
    .then(result => {
      res.json({ error: false, result: result });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

module.exports = router;
