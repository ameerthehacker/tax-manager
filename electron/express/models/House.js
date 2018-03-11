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
  },
  getHouse: (db, id) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT id, owner_name, house_number FROM houses WHERE id=?",
        [id],
        (err, house) => {
          if (!err) {
            resolve(house);
          } else {
            reject(err);
          }
        }
      );
    });
  },
  updateHouse: (db, id, params) => {
    return new Promise((resolve, reject) => {
      db.run(
        "UPDATE houses SET owner_name=?, house_number=? WHERE id=?",
        [params.owner_name, params.house_number, id],
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      );
    });
  }
};
