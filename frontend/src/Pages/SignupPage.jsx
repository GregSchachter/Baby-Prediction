import { useContext, useState } from "react";
import "../Styles/Signup.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import authContext from "../Context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { authInfo, setAuthInfo } = useContext(authContext);
  const [valid, setValid] = useState(true);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

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
    const signupData = {
      email: info.email,
      password: info.password,
      firstName: info.firstName,
      lastName: info.lastName,
    };
    try {
      const res = await axios.post("/api/signup", signupData, {
        withCredentials: true,
        timeout: 120000,
      });
      setAuthInfo({
        auth: true,
        user: res.data.user,
        hasPredicted: false,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      setValid(false);
      setErr(error.response.data.error);
    }
  };

  return (
    <div>
      <form id="regForm" onSubmit={handleSubmit}>
        <label htmlFor="firstName">First Name:</label>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={info.firstName}
          onChange={handleChange}></input>
        <label htmlFor="lastName">Last Name:</label>
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={info.lastName}
          onChange={handleChange}></input>
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
        <button>Submit</button>
        <div id="loginError">{valid ? null : <p>{err}</p>}</div>
      </form>
    </div>
  );
};

export default SignupPage;
