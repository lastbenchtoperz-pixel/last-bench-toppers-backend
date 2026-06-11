const db = require("../config/db");

const globalSearch = (req, res) => {

  const keyword = `%${req.query.q}%`;

  const notesQuery =
    "SELECT id,title,subject,'Note' AS type FROM notes WHERE title LIKE ? OR subject LIKE ?";

  const pyqsQuery =
    "SELECT id,title,subject,'PYQ' AS type FROM pyqs WHERE title LIKE ? OR subject LIKE ?";

  db.query(notesQuery, [keyword, keyword], (err, notes) => {

    if (err) return res.status(500).json(err);

    db.query(pyqsQuery, [keyword, keyword], (err, pyqs) => {

      if (err) return res.status(500).json(err);

      res.json([
        ...notes,
        ...pyqs
      ]);

    });

  });

};

module.exports = {
  globalSearch
};