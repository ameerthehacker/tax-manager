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
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT h.id as house_id, h.owner_name, t.tax, p.amount, p.paid_amount FROM houses h LEFT OUTER JOIN taxes t LEFT OUTER JOIN payments p on t.id = p.tax_id AND p.house_id = h.id AND p.sheet_id=?`,
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
  }
};
