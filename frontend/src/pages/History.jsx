import { useState, useEffect } from "react";
import axios from "axios";

export default function History() {
  const [transcriptions, setTranscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTranscriptions = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/transcriptions");
        setTranscriptions(res.data.transcriptions);
      } catch (err) {
        setError(err.response?.data?.error || err.message || "Failed to fetch transcriptions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTranscriptions();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/transcriptions/${id}`);
      setTranscriptions((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      alert("Failed to delete transcription.");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Transcription History</h2>
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-xl p-5 space-y-2 animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="font-bold text-2xl">Transcription History</h2>
        <div className="glass rounded-xl p-5 border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-2xl">Transcription History</h2>

      {transcriptions.length === 0 ? (
        <div className="glass rounded-xl p-10 text-center">
          <p className="text-white/40">No transcriptions yet. Go transcribe some audio!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {transcriptions.map((t) => (
            <div key={t._id} className="glass rounded-xl p-5 space-y-3">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-semibold text-white/90 text-sm">{t.originalName}</p>
                  <p className="text-xs text-white/30">
                    {new Date(t.createdAt).toLocaleString()}
                    {t.duration != null && ` · ${t.duration.toFixed(1)}s`}
                    {t.confidence != null && ` · ${(t.confidence * 100).toFixed(1)}% confidence`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-xs text-white/30 hover:text-red-400 transition-colors duration-150 shrink-0"
                >
                  Delete
                </button>
              </div>

              {/* Transcript Text */}
              <p className="text-white/80 text-sm leading-relaxed">
                {t.transcript || <span className="text-white/30 italic">No transcript available.</span>}
              </p>

              {/* Status Badge */}
              <span className={`inline-block text-xs px-2 py-0.5 rounded-full
                ${t.status === "completed" ? "bg-emerald-500/15 text-emerald-400" : ""}
                ${t.status === "failed" ? "bg-red-500/15 text-red-400" : ""}
                ${t.status === "processing" ? "bg-amber-500/15 text-amber-400" : ""}
                ${t.status === "pending" ? "bg-white/10 text-white/40" : ""}
              `}>
                {t.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
