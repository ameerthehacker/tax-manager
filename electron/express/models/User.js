module.exports = {
  findUserByUsername: (db, username) => {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT username, password FROM users WHERE username=?",
        [username],
        (err, user) => {
          if (!err) {
            resolve(user);
          } else {
            reject(err);
          }
        }
      );
    });
  }
};
