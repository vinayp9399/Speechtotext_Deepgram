import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="border-b border-white/[0.06] sticky top-0 z-50"
      style={{ background: "rgba(13,13,13,0.85)", backdropFilter: "blur(16px)" }}>
      <nav className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl tracking-tight text-gradient">
          VoiceScribe
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${pathname === "/" ? "bg-wave-500/20 text-wave-400" : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"}`}>
                Transcribe
              </Link>
              <Link to="/history"
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-150
                  ${pathname === "/history" ? "bg-wave-500/20 text-wave-400" : "text-white/50 hover:text-white/80 hover:bg-white/[0.05]"}`}>
                History
              </Link>
              <span className="text-white/30 text-sm ml-2">{user.name}</span>
              <button
                onClick={handleLogout}
                className="ml-1 px-3 py-1.5 rounded-lg text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.05] transition-all duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login"
                className="px-4 py-1.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/80 hover:bg-white/[0.05] transition-all duration-150">
                Login
              </Link>
              <Link to="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-medium bg-wave-500 hover:bg-wave-600 text-white transition-all duration-150">
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
