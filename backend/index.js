require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const uploadRoutes = require("./routes/upload");
const transcriptionRoutes = require("./routes/transcriptions");

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/upload", uploadRoutes);
app.use("/api/transcriptions", transcriptionRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "VoiceScribe API is running",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
