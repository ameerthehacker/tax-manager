module.exports = {
  getAllVillages: db => {
    return new Promise((resolve, reject) => {
      db.all("SELECT id, village_name FROM villages", (err, villages) => {
        if (!err) {
          resolve(villages);
        } else {
          reject(err);
        }
      });
    });
  }
};
