module.exports = {
  getHouses: (db, page = 1, query = null) => {
    const pageSize = 10;
    const offset = pageSize * (page - 1);

    return new Promise((resolve, reject) => {
      let queryClause = "";
      if (query != null) {
        queryClause = `WHERE owner_name LIKE '${query}%'`;
      }
      db.all(
        `SELECT id, owner_name FROM houses ${queryClause} LIMIT ${offset},${pageSize}`,
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
  getHousesCount: (db, query) => {
    return new Promise((resolve, reject) => {
      let queryClause = "";
      if (query != null) {
        queryClause = `WHERE owner_name LIKE '${query}%'`;
      }
      db.all(
        `SELECT count(id) as total FROM houses ${queryClause}`,
        (err, result) => {
          if (!err) {
            resolve(result[0].total);
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
