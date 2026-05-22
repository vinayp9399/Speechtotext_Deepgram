const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");
const Transcription = require("../models/Transcription");

router.post("/", upload.single("audio"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const { originalname, filename, size, mimetype } = req.file;

   
    const transcription = await Transcription.create({
      fileName: filename,
      originalName: originalname,
      fileSize: size,
      mimeType: mimetype,
      transcript: "",
      status: "pending",
    });

    res.status(201).json({
      message: "File uploaded successfully. Transcription pending.",
      transcriptionId: transcription._id,
      file: {
        name: filename,
        originalName: originalname,
        size,
        mimeType: mimetype,
      },
    });
  } catch (error) {
   
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    next(error);
  }
});


router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(400)
      .json({ error: "File too large. Maximum size is 50MB." });
  }
  if (err.message && err.message.startsWith("Unsupported file type")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
