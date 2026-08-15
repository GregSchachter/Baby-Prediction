import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import authContext from "../Context/AuthContext";
import "../Styles/Login.css";
import axios from "axios";

const LoginPage = () => {
  const [info, setInfo] = useState({
    email: "",
    password: "",
  });
  const [valid, setValid] = useState(true);
  const navigate = useNavigate();
  const { authInfo, setAuthInfo } = useContext(authContext);

  const handleChange = (e) => {
    setValid(true);
    const { name, value } = e.target;

    setInfo((i) => ({
      ...i,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loginData = {
      email: info.email,
      password: info.password,
    };
    try {
      const res = await axios.post("login", loginData, {
        withCredentials: true,
        timeout: 120000,
      });
      setAuthInfo({
        auth: true,
        user: res.data.user,
        hasPredicted: res.data.hasPredicted || false,
      });
      navigate("/");
    } catch (error) {
      setValid(false);
    }
  };

  const forgotPassBtn = () => {
    navigate("/forgotpassword");
  };

  return (
    <div>
      <form id="loginForm" onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={info.email}
          onChange={handleChange}></input>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={info.password}
          onChange={handleChange}></input>
        <button type="submit">Submit</button>
        <button type="button" onClick={forgotPassBtn}>
          Forgot Password
        </button>
        <div id="loginError">
          {valid ? null : <p>Incorrect Username or Password</p>}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
