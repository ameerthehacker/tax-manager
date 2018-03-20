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

router.post("/:id/taxes/new", (req, res) => {
  const db = req.app.get("db");
  const id = req.params.id;
  const houseId = req.body.houseId;
  const taxId = req.body.taxId;

  Sheet.addTax(db, id, houseId, taxId)
    .then(result => {
      res.json({ error: false, result: result });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

router.post("/", (req, res) => {
  const db = req.app.get("db");
  const fromYear = req.body.fromYear;
  const toYear = req.body.toYear;

  Sheet.addSheet(db, fromYear, toYear)
    .then(result => {
      res.json({ error: false, result: result });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

router.post("/print", (req, res) => {
  // Print the current page
  req.app.emit("print");
  res.json({ error: false });
});

module.exports = router;
