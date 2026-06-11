const db = require("../config/db");

const getStats = async (req, res) => {

  const usersQuery =
    "SELECT COUNT(*) AS totalUsers FROM users";

  const notesQuery =
    "SELECT COUNT(*) AS totalNotes FROM notes";

  const pyqsQuery =
    "SELECT COUNT(*) AS totalPyqs FROM pyqs";

  db.query(usersQuery, (err, users) => {

    if (err) return res.status(500).json(err);

    db.query(notesQuery, (err, notes) => {

      if (err) return res.status(500).json(err);

      db.query(pyqsQuery, (err, pyqs) => {

        if (err) return res.status(500).json(err);

        res.json({
          totalUsers: users[0].totalUsers,
          totalNotes: notes[0].totalNotes,
          totalPyqs: pyqs[0].totalPyqs
        });

      });

    });

  });

};

module.exports = { getStats };