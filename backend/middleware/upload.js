const multer = require("multer");
const path = require("path");
const fs = require("fs");


const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `audio-${uniqueSuffix}${ext}`);
  },
});


const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "audio/mpeg",       
    "audio/mp3",
    "audio/wav",        
    "audio/wave",
    "audio/x-wav",
    "audio/webm",       
    "audio/ogg",        
    "audio/flac",       
    "audio/mp4",        
    "audio/x-m4a",
    "video/webm",       
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Unsupported file type: ${file.mimetype}. Please upload an audio file (mp3, wav, webm, ogg, flac, m4a).`
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },
});

module.exports = upload;
