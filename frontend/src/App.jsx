import { useEffect, useState } from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import axios from "axios";
import authContext from "./Context/AuthContext";

function App() {
  const [authInfo, setAuthInfo] = useState({
    auth: false,
    user: "",
    hasPredicted: false,
  });

  const url = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const checkServerAndAuth = async () => {
      try {
        // Wake up the server first
        await axios.get(`${url}/health`, {
          timeout: 30000,
        });

        console.log("Server is awake");

        // Then check authentication
        const res = await axios.get(`${url}/me`, {
          withCredentials: true,
        });

        setAuthInfo({
          auth: res.data.auth,
          user: res.data.user || null,
          hasPredicted: res.data.hasPredicted || false,
        });
      } catch (error) {
        console.log("Server health check failed:", error.message);

        setAuthInfo({
          auth: false,
          user: null,
          hasPredicted: false,
        });
      }
    };

    checkServerAndAuth();
  }, [url]);
  const contextValue = { authInfo, setAuthInfo };

  return (
    <authContext.Provider value={contextValue}>
      <AppRoutes />
    </authContext.Provider>
  );
}

export default App;
