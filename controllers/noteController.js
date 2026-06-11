const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const db = require("../config/db");

// --- Controller Functions ---

/**
 * POST /api/notes/upload
 * Handles PDF upload, text extraction, and saving to DB
 */
const uploadNote = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No PDF uploaded" });
    }

    const { title, subject } = req.body;
    if (!title || !subject) {
      return res.status(400).json({ message: "Title and subject are required" });
    }

    const filename = req.file.filename;

    // Read local file into memory buffer
    const pdfBuffer = fs.readFileSync(req.file.path);

    // Extract text layout from PDF buffer
    const pdfData = await pdfParse(pdfBuffer);
    const extractedText = pdfData.text || "";

    console.log("Extracted Text Length:", extractedText.length);

    // SQL insertion statement
    const sql = "INSERT INTO notes (title, subject, filename, content) VALUES (?, ?, ?, ?)";

    db.query(
      sql, 
      [title, subject, filename, extractedText], 
      (err, result) => {
        if (err) {
          console.error("Database Insertion Error:", err);
          return res.status(500).json({ message: "Database Error" });
        }

        return res.json({
          message: "Note Uploaded Successfully",
          noteId: result.insertId,
        });
      }
    );

  } catch (error) {
    console.error("PDF Parsing Catch Block Error:", error);
    return res.status(500).json({ message: "PDF Processing Failed" });
  }
};

/**
 * GET /api/notes
 * Fetches all notes sorted by latest
 */
const getNotes = (req, res) => {
  const sql = "SELECT * FROM notes ORDER BY id DESC";

  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Database Error", details: err });
    }
    return res.json(result);
  });
};

/**
 * GET /api/notes/summary/:subject
 * Retrieves a note and generates a substring text summary
 */
const getSummary = (req, res) => {
  const subject = req.params.subject;
const sql = `
  SELECT * FROM notes 
  WHERE LOWER(subject) LIKE LOWER(?) 
     OR LOWER(title) LIKE LOWER(?) 
  LIMIT 1
`;

  db.query(sql, [`%${subject}%`,`%${subject}%`], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Internal Database Error", details: err });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: "No notes found" });
    }

    const content = result[0].content || "";

    // Normalize spacing and pull standard text slice
    const cleanedContent = content.replace(/\s+/g, " ").trim();
    const summary = cleanedContent.substring(0, 1200);

    return res.json({
      title: result[0].title,
      subject: result[0].subject,
      summary: summary
    });
  });
};

// --- Module Exports ---
module.exports = {
  uploadNote,
  getNotes,
  getSummary,
};