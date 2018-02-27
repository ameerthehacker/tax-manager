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
  }
};
