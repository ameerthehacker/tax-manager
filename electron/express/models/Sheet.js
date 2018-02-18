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
  }
};
