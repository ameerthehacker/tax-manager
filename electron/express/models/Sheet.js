const Tax = require("./Tax");
const House = require("./House");

module.exports = {
  getAllSheets: (db, villageId) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id, from_year, to_year FROM sheets WHERE village_id=?",
        [villageId],
        (err, sheets) => {
          if (!err) {
            resolve(sheets);
          } else {
            reject(err);
          }
        }
      );
    });
  },
  updateAmount: (db, id, houseId, taxId, amount) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id FROM payments WHERE sheet_id=? AND house_id=? AND tax_id=?",
        [id, houseId, taxId],
        (err, sheets) => {
          if (!err) {
            if (sheets.length !== 0) {
              db.run(
                "UPDATE payments SET amount=? WHERE sheet_id=? AND house_id=? AND tax_id=?",
                [amount, id, houseId, taxId],
                (err, result) => {
                  if (!err) {
                    resolve(result);
                  } else {
                    reject(err);
                  }
                }
              );
            } else {
              db.run(
                "INSERT INTO payments (sheet_id, house_id, tax_id, amount) VALUES(?, ?, ?, ?)",
                [id, houseId, taxId, amount],
                (err, result) => {
                  if (!err) {
                    resolve(result);
                  } else {
                    reject(err);
                  }
                }
              );
            }
          } else {
            reject(err);
          }
        }
      );
    });
  },
  updatePaid: (db, id, houseId, taxId, amount) => {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT id FROM payments WHERE sheet_id=? AND house_id=? AND tax_id=?",
        [id, houseId, taxId],
        (err, sheets) => {
          if (!err) {
            if (sheets.length !== 0) {
              db.run(
                "UPDATE payments SET paid_amount=? WHERE sheet_id=? AND house_id=? AND tax_id=?",
                [amount, id, houseId, taxId],
                (err, result) => {
                  if (!err) {
                    resolve(result);
                  } else {
                    reject(err);
                  }
                }
              );
            } else {
              db.run(
                "INSERT INTO payments (sheet_id, house_id, tax_id, paid_amount) VALUES(?, ?, ?, ?)",
                [id, houseId, taxId, amount],
                (err, result) => {
                  if (!err) {
                    resolve(result);
                  } else {
                    reject(err);
                  }
                }
              );
            }
          } else {
            reject(err);
          }
        }
      );
    });
  },
  getSheet: (db, id, page = 1, query = null) => {
    let previousBalanceSheet = {};
    let currentBalanceSheet = {};
    let availableTaxes = [];
    let availableHouses = [];
    let queryClause = "";
    let totalHouses = 0;
    const pageSize = 10;
    const offset = pageSize * (page - 1);

    if (query != null) {
      queryClause = `AND h.owner_name LIKE '${query}%'`;
    }
    // Previous year balances
    const previousBalance = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.id as house_id, h.owner_name, t.tax, t.id as tax_id, SUM(p.amount - p.paid_amount) as balance FROM houses h INNER JOIN payments p ON p.house_id = h.id INNER JOIN taxes t on p.tax_id = t.id INNER JOIN sheets s ON s.id = p.sheet_id WHERE s.to_year < (SELECT to_year FROM sheets WHERE id=?) AND village_id=1 ${queryClause} group by p.tax_id, p.house_id`,
          [id],
          (err, sheet) => {
            if (!err) {
              resolve(sheet);
            } else {
              reject(err);
            }
          }
        );
      });
    };
    // Current year amount to be paid
    const currentBalance = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.id as house_id, h.owner_name, t.id as tax_id,t.tax, p.paid_amount, p.amount FROM houses h INNER JOIN taxes t INNER JOIN payments p on t.id = p.tax_id AND p.house_id = h.id AND p.sheet_id=? ${queryClause}`,
          [id],
          (err, sheet) => {
            if (!err) {
              resolve(sheet);
            } else {
              reject(err);
            }
          }
        );
      });
    };

    return previousBalance()
      .then(result => {
        previousBalanceSheet = result;
        return currentBalance();
      })
      .then(result => {
        currentBalanceSheet = result;
        return Tax.getTaxes(db);
      })
      .then(result => {
        availableTaxes = result;
        return House.getHouses(db, page, query);
      })
      .then(result => {
        availableHouses = result;
        return House.getHousesCount(db);
      })
      .then(result => {
        totalHouses = result;
        return {
          pageSize: pageSize,
          totalHouses: totalHouses,
          previousBalanceSheet: previousBalanceSheet,
          currentBalanceSheet: currentBalanceSheet,
          availableTaxes: availableTaxes,
          availableHouses: availableHouses
        };
      });
  },
  addTax: (db, sheetId, houseId, taxId) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO payments (sheet_id, house_id, tax_id) VALUES(?, ?, ?)",
        [sheetId, houseId, taxId],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    });
  },
  addSheet: (db, villageId, fromYear, toYear) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO sheets (village_id, from_year, to_year) VALUES(?, ?, ?)",
        [villageId, fromYear, toYear],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    });
  },
  getBill: (db, sheetId, houseId) => {
    let previousBalanceSheet = {};
    let currentBalanceSheet = {};
    let availableTaxes = [];
    let house = {};

    // Previous year balances
    const previousBalance = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.id as house_id, h.owner_name, t.tax, t.id as tax_id, SUM(p.amount - p.paid_amount) as balance FROM houses h INNER JOIN payments p ON p.house_id = h.id INNER JOIN taxes t on p.tax_id = t.id INNER JOIN sheets s ON s.id = p.sheet_id WHERE s.to_year < (SELECT to_year FROM sheets WHERE id=?) AND h.id=? group by p.tax_id, p.house_id`,
          [sheetId, houseId],
          (err, sheet) => {
            if (!err) {
              resolve(sheet);
            } else {
              reject(err);
            }
          }
        );
      });
    };
    // Current year amount to be paid
    const currentBalance = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.id as house_id, h.owner_name, t.id as tax_id, t.tax, p.paid_amount, p.amount FROM houses h INNER JOIN taxes t INNER JOIN payments p on t.id = p.tax_id AND p.house_id = h.id AND p.sheet_id=? WHERE h.id=?`,
          [sheetId, houseId],
          (err, sheet) => {
            if (!err) {
              resolve(sheet);
            } else {
              reject(err);
            }
          }
        );
      });
    };

    return previousBalance()
      .then(result => {
        previousBalanceSheet = result;
        return currentBalance();
      })
      .then(result => {
        currentBalanceSheet = result;
        return Tax.getTaxes(db);
      })
      .then(result => {
        availableTaxes = result;
        return House.getHouse(db, houseId);
      })
      .then(result => {
        house = result;
        return {
          previousBalanceSheet: previousBalanceSheet,
          currentBalanceSheet: currentBalanceSheet,
          availableTaxes: availableTaxes,
          house: house
        };
      });
  }
};
