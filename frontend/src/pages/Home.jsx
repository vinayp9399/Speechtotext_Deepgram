import { useState, useRef } from "react";
import { uploadAudio } from "../utils/api";

export default function Home() {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

 
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);


  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState(null);
  const [error, setError] = useState(null);

  const handleFileInput = (e) => {
    setSelectedFile(e.target.files[0]);
    setTranscript(null);
    setError(null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setTranscript(null);
      setError(null);
    }
  };

  
  const startRecording = async () => {
    setError(null);
    setTranscript(null);
    setSelectedFile(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        setSelectedFile(file);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied. Please allow microphone permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  
  const handleTranscribe = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);
    setTranscript(null);

    try {
      const res = await uploadAudio(selectedFile);
      setTranscript(res.data.transcription);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
     
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => document.getElementById("file-input").click()}
        className={`glass rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
          ${dragOver ? "border-wave-400/60 bg-wave-500/10" : "glass-hover"}
          ${selectedFile && !isRecording ? "border-emerald-400/40 bg-emerald-500/5" : ""}
        `}
      >
        <input
          id="file-input"
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={handleFileInput}
        />

        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-4xl">🎵</p>
            <p className="font-semibold text-emerald-400">{selectedFile.name}</p>
            <p className="text-sm text-white/40">
              {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-5xl">📂</p>
            <p className="text-white/70 font-semibold">
              Click to upload or drag & drop an audio file
            </p>
            <p className="text-sm text-white/30">MP3, WAV, WEBM, OGG, FLAC, M4A · Max 50MB</p>
          </div>
        )}
      </div>

      
      <div className="flex justify-center">
        {isRecording ? (
          <button
            onClick={stopRecording}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all duration-200"
          >
            ⏹ Stop Recording
          </button>
        ) : (
          <button
            onClick={startRecording}
            className="flex items-center gap-2 px-8 py-3 rounded-xl glass glass-hover text-white/70 hover:text-white font-semibold transition-all duration-200"
          >
            🎙️ Record Audio
          </button>
        )}
      </div>

      
      <div className="flex justify-center">
        <button
          onClick={handleTranscribe}
          disabled={!selectedFile || loading}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-semibold transition-all duration-200
            ${selectedFile && !loading
              ? "bg-wave-500 hover:bg-wave-600 text-white"
              : "bg-white/5 text-white/30 cursor-not-allowed"
            }`}
        >
          {loading ? "Transcribing..." : "⚡ Transcribe Audio"}
        </button>
      </div>

      
      {loading && (
        <div className="glass rounded-xl p-6 text-center">
          <p className="text-white/50 animate-pulse">
            Sending to Deepgram, please wait...
          </p>
        </div>
      )}

      
      {error && (
        <div className="glass rounded-xl p-5 border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      
      {transcript && (
        <div className="glass rounded-xl p-6 space-y-3">
          <h2 className="font-semibold text-white/80">Transcription</h2>
          <p className="text-white/90 leading-relaxed">{transcript.transcript}</p>
          {transcript.confidence != null && (
            <p className="text-xs text-white/30">
              Confidence: {(transcript.confidence * 100).toFixed(1)}%
              {transcript.duration != null && ` · Duration: ${transcript.duration.toFixed(1)}s`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
