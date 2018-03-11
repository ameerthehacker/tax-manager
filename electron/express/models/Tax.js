module.exports = {
  getTaxes: db => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, tax FROM taxes", (err, taxes) => {
        if (!err) {
          resolve(taxes);
        } else {
          reject(err);
        }
      });
    });
  },
  addTax: (db, taxName) => {
    return new Promise((resolve, reject) => {
      db.run("INSERT INTO taxes (tax) VALUES (?)", [taxName], (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  }
};
