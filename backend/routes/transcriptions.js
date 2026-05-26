const express = require("express");
const router = express.Router();
const Transcription = require("../models/Transcription");
const protect = require("../middleware/auth");


router.use(protect);


router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const transcriptions = await Transcription.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("-__v");

    const total = await Transcription.countDocuments({ userId: req.user._id });

    res.json({
      transcriptions,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const transcription = await Transcription.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).select("-__v");

    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found." });
    }
    res.json(transcription);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const transcription = await Transcription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found." });
    }
    res.json({ message: "Transcription deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
