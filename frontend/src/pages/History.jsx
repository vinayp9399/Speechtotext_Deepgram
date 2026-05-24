

export default function History() {
  return (
    <div className="animate-fade-in space-y-8">
      <div className="space-y-1">
        <h2 className="font-display font-bold text-3xl tracking-tight">
          Transcription History
        </h2>
        <p className="text-white/40 font-body">
          Your saved transcriptions will appear here.
        </p>
      </div>

      
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="glass rounded-xl p-5 space-y-2 animate-pulse"
          >
            <div className="h-4 bg-white/10 rounded w-1/3" />
            <div className="h-3 bg-white/5 rounded w-2/3" />
            <div className="h-3 bg-white/5 rounded w-1/2" />
          </div>
        ))}
      </div>

      <p className="text-center text-white/20 text-sm font-mono">
        — MongoDB integration coming Day 4 —
      </p>
    </div>
  );
}
