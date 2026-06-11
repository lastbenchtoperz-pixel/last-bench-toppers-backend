const db = require("../config/db");

const createAnnouncement = (req, res) => {

  const { title, description } = req.body;

  const sql =
    "INSERT INTO announcements (title, description) VALUES (?, ?)";

  db.query(sql, [title, description], (err, result) => {

    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Announcement Created"
    });

  });

};

const getAnnouncements = (req, res) => {

  db.query(
    "SELECT * FROM announcements ORDER BY id DESC",
    (err, result) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(result);

    }
  );

};

module.exports = {
  createAnnouncement,
  getAnnouncements
};