const express = require("express");
const router = express.Router();
const House = require("../models/House");

router.get("/", (req, res) => {
  res.json({ msg: "TODO:// Things are yet to be done" });
});
router.get("/:id", (req, res) => {
  const db = req.app.get("db");
  const houseId = req.params.id;

  House.getHouse(db, houseId)
    .then(house => {
      res.json({ error: false, house: house });
    })
    .catch(err => {
      res.json({ error: err });
    });
});
router.post("/", (req, res) => {
  const db = req.app.get("db");
  const houseId = req.params.id;
  const params = {
    owner_name: req.body.owner_name,
    house_number: req.body.house_number
  };

  House.insertHouse(db, houseId, params)
    .then(result => {
      res.json({ error: false, result: result });
    })
    .catch(err => {
      res.json({ error: err });
    });
});
router.put("/:id", (req, res) => {
  const db = req.app.get("db");
  const houseId = req.params.id;
  const params = {
    owner_name: req.body.owner_name,
    house_number: req.body.house_number
  };

  House.updateHouse(db, houseId, params)
    .then(result => {
      res.json({ error: false, result: result });
    })
    .catch(err => {
      res.json({ error: err });
    });
});

module.exports = router;
