const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema(
  {
    
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: null,
    },

    
    transcript: {
      type: String,
      required: true,
      default: "",
    },
    confidence: {
      type: Number, // 0–1, from Deepgram
      default: null,
    },
    language: {
      type: String,
      default: "en",
    },

    
    deepgramModel: {
      type: String,
      default: "nova-2",
    },
    deepgramRequestId: {
      type: String,
      default: null,
    },

    
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    errorMessage: {
      type: String,
      default: null,
    },

    
    userId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, 
  }
);


transcriptionSchema.index({ createdAt: -1 });
transcriptionSchema.index({ userId: 1, createdAt: -1 });

const Transcription = mongoose.model("Transcription", transcriptionSchema);

module.exports = Transcription;
