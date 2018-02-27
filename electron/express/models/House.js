module.exports = {
  getHouses: db => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, owner_name FROM houses", (err, houses) => {
        if (!err) {
          resolve(houses);
        } else {
          reject(err);
        }
      });
    });
  }
};
