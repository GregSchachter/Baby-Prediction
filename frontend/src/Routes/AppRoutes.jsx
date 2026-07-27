import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import SignupPage from "../Pages/SignupPage";
import PredictPage from "../Pages/PredictPage";
import axios from "axios";

export default function AppRoutes() {
  const url = import.meta.env.VITE_URL;
  const handleClick = async () => {
    const res = await axios.get(`${url}/logout`, {
      withCredentials: true,
    });
  };

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
        <Link to="/predict">Prediction</Link>
        <button id="logoutButton" onClick={handleClick}>
          Logout
        </button>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignupPage />} />
        <Route path="/predict" element={<PredictPage />} />
      </Routes>
    </BrowserRouter>
  );
}
