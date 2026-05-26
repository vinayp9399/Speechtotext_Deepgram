const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const upload = require("../middleware/upload");
const Transcription = require("../models/Transcription");
const { transcribeAudio } = require("../config/deepgram");
const protect = require("../middleware/auth");


router.post("/", protect, upload.single("audio"), async (req, res, next) => {
  let filePath = null;
  let transcriptionDoc = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided." });
    }

    const { originalname, filename, size, mimetype } = req.file;
    filePath = path.join(__dirname, "../uploads", filename);

    
    transcriptionDoc = await Transcription.create({
      fileName: filename,
      originalName: originalname,
      fileSize: size,
      mimeType: mimetype,
      transcript: "",
      status: "processing",
      userId: req.user._id,
    });

    
    let result;
    try {
      result = await transcribeAudio(filePath, mimetype);
    } catch (deepgramError) {
      
      transcriptionDoc.status = "failed";
      transcriptionDoc.errorMessage = deepgramError.message;
      await transcriptionDoc.save();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      return res.status(502).json({ error: "Transcription service failed. Please try again." });
    }

    
    transcriptionDoc.transcript = result.transcript;
    transcriptionDoc.confidence = result.confidence;
    transcriptionDoc.duration = result.duration;
    transcriptionDoc.deepgramRequestId = result.requestId;
    transcriptionDoc.status = "completed";
    await transcriptionDoc.save();

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(201).json({
      message: "Transcription completed.",
      transcription: transcriptionDoc,
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
