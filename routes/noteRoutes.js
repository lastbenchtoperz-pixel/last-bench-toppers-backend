const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
// Grouped all controller imports together at the top
const { uploadNote, getNotes, getSummary } = require("../controllers/noteController");

// --- Routes ---

// Post a new note (with file upload handling and debug logging)
router.post(
  "/upload",
  (req, res, next) => {
    console.log("Route hit: /upload");
    next();
  },
  upload.single("pdf"),
  (req, res, next) => {
    console.log("After multer file parsing:", req.file);
    next();
  },
  uploadNote
);

// Get all notes
router.get("/", getNotes);

// Get a summary for a specific subject
router.get("/summary/:subject", getSummary);

module.exports = router;