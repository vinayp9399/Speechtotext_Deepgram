require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");

const uploadRoutes = require("./routes/upload");
const transcriptionRoutes = require("./routes/transcriptions");

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api/upload", uploadRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "VoiceScribe API is running",
  });
});

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost: ${PORT}`);
});
