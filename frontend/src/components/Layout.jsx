import { Link, useLocation } from "react-router-dom";

export default function Layout({ children }) {
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/[0.06] sticky top-0 z-50"
        style={{ background: "rgba(13,13,13,0.85)", backdropFilter: "blur(16px)" }}>
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="text-2xl">🎙️</span>
            <span className="font-display font-bold text-xl tracking-tight text-gradient">
              VoiceScribe
            </span>
          </Link>

         
          <div className="flex items-center gap-1">
            <NavLink to="/" active={pathname === "/"}>
              Transcribe
            </NavLink>
            <NavLink to="/history" active={pathname === "/history"}>
              History
            </NavLink>
          </div>
        </nav>
      </header>

      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {children}
      </main>

      
      <footer className="border-t border-white/[0.06] py-6 text-center">
        <p className="text-sm text-white/30 font-body">
          Built with MERN · Deepgram · Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 font-body
        ${active
          ? "bg-wave-500/20 text-wave-400"
          : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"
        }`}
    >
      {children}
    </Link>
  );
}
