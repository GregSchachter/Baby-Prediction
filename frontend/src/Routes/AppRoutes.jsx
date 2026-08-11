import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import HomePage from "../Pages/HomePage";
import LoginPage from "../Pages/LoginPage";
import SignupPage from "../Pages/SignupPage";
import PredictPage from "../Pages/PredictPage";
import axios from "axios";
import { useContext } from "react";
import authContext from "../Context/AuthContext";
import PredictionsPage from "../Pages/PredictionsPage";
import ProtectRoute from "./ProtectRoute";
import PublicRoute from "./PublicRoute";
import ForgotPassword from "../Pages/ForgotPassword";
import ResetPassword from "../Pages/ResetPassword";

export default function AppRoutes() {
  const { authInfo, setAuthInfo } = useContext(authContext);
  const url = import.meta.env.VITE_API_URL;
  const handleClick = async () => {
    const res = await axios.get(`${url}/logout`, {
      withCredentials: true,
    });
    setAuthInfo({
      auth: false,
      user: null,
    });
  };
  console.log();
  if (authInfo.auth === null) return null;

  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        {!authInfo.auth ? <Link to="/login">Login</Link> : null}
        {!authInfo.auth ? <Link to="/register">Sign Up</Link> : null}
        {authInfo.auth ? <Link to="/predict">Predict</Link> : null}
        {authInfo.auth ? <Link to="/predictions">Predictions</Link> : null}
        {authInfo.auth ? (
          <button id="logoutButton" onClick={handleClick}>
            Logout
          </button>
        ) : null}
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
        </Route>
        <Route element={<ProtectRoute />}>
          <Route path="/predict" element={<PredictPage />} />
          <Route path="/predictions" element={<PredictionsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
