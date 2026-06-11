const express = require("express");
const router = express.Router();

const upload =
  require("../middleware/upload");

const {
  uploadPyq,
  getPyqs
} = require("../controllers/pyqController");

router.get("/", getPyqs);

router.post(
  "/upload",
  upload.single("pdf"),
  uploadPyq
);

module.exports = router;