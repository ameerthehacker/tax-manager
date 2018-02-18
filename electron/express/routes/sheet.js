const express = require("express");
const router = express.Router();

const Sheet = require("../models/Sheet");

router.get("/", (req, res) => {
  const db = req.app.get("db");
  Sheet.getAllSheets(db)
    .then(sheets => {
      res.json({ error: false, sheets: sheets });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

router.get("/:id", (req, res) => {
  const db = req.app.get("db");
  const id = req.params.id;
  Sheet.getSheet(db, id)
    .then(sheet => {
      res.json({ error: false, sheet: sheet });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

module.exports = router;
