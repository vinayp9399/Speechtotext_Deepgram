const express = require("express");
const router = express.Router();
const Transcription = require("../models/Transcription");


router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const transcriptions = await Transcription.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .select("-__v");

    const total = await Transcription.countDocuments(filter);

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
    const transcription = await Transcription.findById(req.params.id).select(
      "-__v"
    );
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
    const transcription = await Transcription.findByIdAndDelete(req.params.id);
    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found." });
    }
    res.json({ message: "Transcription deleted successfully." });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
