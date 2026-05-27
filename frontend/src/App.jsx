import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import History from "./pages/History";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {

  const token = localStorage.getItem("token");

  const ProtectedRoute = ({element})=>{
    return token ? element : <Login/>
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
          <Routes>
            <Route path="/" element={<ProtectedRoute element={<Home />}/>} />
            <Route path="/history" element={<ProtectedRoute element={<History />}/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
