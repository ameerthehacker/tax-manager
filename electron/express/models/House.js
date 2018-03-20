module.exports = {
  getHouses: (db, query = null) => {
    return new Promise((resolve, reject) => {
      let queryClause = "";
      if (query != null) {
        queryClause = `WHERE owner_name LIKE '${query}%'`;
      }
      db.all(
        `SELECT id, owner_name FROM houses ${queryClause}`,
        (err, houses) => {
          if (!err) {
            resolve(houses);
          } else {
            reject(err);
          }
        }
      );
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
  },
  insertHouse: (db, id, params) => {
    return new Promise((resolve, reject) => {
      db.run(
        "INSERT INTO houses (owner_name, house_number) VALUES(?, ?)",
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
