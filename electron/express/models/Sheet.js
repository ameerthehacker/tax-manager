const Tax = require("./Tax");
const House = require("./House");

module.exports = {
  getAllSheets: db => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, from_year, to_year FROM sheets", (err, sheets) => {
        if (!err) {
          resolve(sheets);
        } else {
          reject(err);
        }
      });
    });
  },
  getSheet: (db, id) => {
    let previousBalanceSheet = {};
    let currentBalanceSheet = {};
    let totalToPaySheet = {};
    let availableTaxes = [];
    let availableHouses = [];

    // Previous year balances
    const previousBalance = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.id as house_id, h.owner_name, t.tax, t.id as tax_id, SUM(p.amount - p.paid_amount) as balance FROM houses h INNER JOIN payments p ON p.house_id = h.id INNER JOIN taxes t on p.tax_id = t.id INNER JOIN sheets s ON s.id = p.sheet_id WHERE s.to_year < (SELECT to_year FROM sheets WHERE id=?) group by p.tax_id, p.house_id`,
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
          `SELECT h.id as house_id, h.owner_name, t.id as tax_id,t.tax, p.paid_amount, p.amount FROM houses h INNER JOIN taxes t INNER JOIN payments p on t.id = p.tax_id AND p.house_id = h.id AND p.sheet_id=?`,
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

    // Total balance to be paid this year
    const totalToPay = () => {
      return new Promise((resolve, reject) => {
        db.all(
          `SELECT h.owner_name, t.tax, SUM(p.amount - p.paid_amount) as balance FROM houses h INNER JOIN payments p ON p.house_id = h.id INNER JOIN taxes t on p.tax_id = t.id INNER JOIN sheets s ON s.id = p.sheet_id WHERE s.to_year <= (SELECT to_year FROM sheets WHERE id=?) group by p.tax_id, p.house_id`,
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
        return totalToPay();
      })
      .then(result => {
        totalToPaySheet = result;
        return Tax.getTaxes(db);
      })
      .then(result => {
        availableTaxes = result;
        return House.getHouses(db);
      })
      .then(result => {
        availableHouses = result;
        return {
          previousBalanceSheet: previousBalanceSheet,
          currentBalanceSheet: currentBalanceSheet,
          totalToPaySheet: totalToPaySheet,
          availableTaxes: availableTaxes,
          availableHouses: availableHouses
        };
      });
  }
};
