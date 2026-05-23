const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");
const Transcription = require("../models/Transcription");
const { transcribeAudio } = require("../config/deepgram");


router.post("/", upload.single("audio"), async (req, res, next) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const { originalname, filename, size, mimetype } = req.file;
    filePath = path.join(__dirname, "../uploads", filename);

    // Save a pending record first
    const transcription = await Transcription.create({
      fileName: filename,
      originalName: originalname,
      fileSize: size,
      mimeType: mimetype,
      transcript: "",
      status: "processing",
    });

    
    const result = await transcribeAudio(filePath, mimetype);

    
    transcription.transcript = result.transcript;
    transcription.confidence = result.confidence;
    transcription.duration = result.duration;
    transcription.deepgramRequestId = result.requestId;
    transcription.status = "completed";
    await transcription.save();

    
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Transcription completed.",
      transcription,
    });
  } catch (error) {
   
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
    next(error);
  }
});


router.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Maximum size is 50MB." });
  }
  if (err.message && err.message.startsWith("Unsupported file type")) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

module.exports = router;
