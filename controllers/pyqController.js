const db = require("../config/db");

const uploadPyq = (req, res) => {

  const { title, subject } = req.body;

  if (!req.file) {
    return res.status(400).json({
      message: "No PDF uploaded"
    });
  }

  const filename = req.file.filename;

  const sql =
    "INSERT INTO pyqs (title, subject, filename) VALUES (?,?,?)";

  db.query(
    sql,
    [title, subject, filename],
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "PYQ Uploaded Successfully"
      });

    }
  );
};

const getPyqs = (req, res) => {

  db.query(
    "SELECT * FROM pyqs ORDER BY id DESC",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );
};

module.exports = {
  uploadPyq,
  getPyqs
};