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
      sheet.id = id;
      res.json({ error: false, sheet: sheet });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

router.put("/amount/:id", (req, res) => {
  const db = req.app.get("db");
  const id = req.params.id;
  const houseId = req.body.houseId;
  const taxId = req.body.taxId;
  const amount = req.body.amount;
  Sheet.updateAmount(db, id, houseId, taxId, amount)
    .then(result => {
      res.json({ err: false });
    })
    .catch(err => {
      res.json({ err: err });
    });
});

router.put("/paid/:id", (req, res) => {
  const db = req.app.get("db");
  const id = req.params.id;
  const houseId = req.body.houseId;
  const taxId = req.body.taxId;
  const amount = req.body.amount;
  Sheet.updatePaid(db, id, houseId, taxId, amount)
    .then(result => {
      res.json({ err: false });
    })
    .catch(err => {
      res.json({ err: err });
    });
});

module.exports = router;
