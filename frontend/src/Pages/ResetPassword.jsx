import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/ResetPassword.css";
import { useEffect } from "react";
import axios from "axios";

export default function ResetPassword() {
  const { id, token } = useParams();
  const [linkValid, setLinkValid] = useState(null);
  const [valid, setValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [passwords, setPasswords] = useState({
    password1: "",
    password2: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.post("/verifytoken", { id, token });
        setLinkValid(true);
      } catch (error) {
        setLinkValid(false);
      }
    };
    verify();
  }, []);

  const handleChange = (e) => {
    setValid(true);
    const { name, value } = e.target;

    setPasswords((i) => ({
      ...i,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (passwords.password1 !== passwords.password2) {
      setValid(false);
      return;
    }
    const apiData = {
      id,
      token,
      password: passwords.password1,
    };
    try {
      await axios.post("/resetpassword", apiData);
      setSubmitted(true);
    } catch (error) {
      console.log(error);
    }
  };

  if (linkValid === null) {
    return (
      <div className="resetDiv">
        <p>Checking the link...</p>
      </div>
    );
  }

  if (linkValid === false) {
    return (
      <div className="resetDiv">
        <p>The reset link is invalid or has expired.</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="resetDiv">
        <p>Password has been reset.</p>
        <button onClick={() => navigate("/login")}>Login Page</button>
      </div>
    );
  }
  return (
    <form id="resetForm" onSubmit={handleSubmit}>
      <label htmlFor="password1">New Password</label>
      <input
        name="password1"
        type="password"
        placeholder="New Password"
        value={passwords.password1}
        onChange={handleChange}></input>
      <label htmlFor="password2">Confirm Password</label>
      <input
        name="password2"
        type="password"
        placeholder="Confirm Password"
        value={passwords.password2}
        onChange={handleChange}></input>
      <button type="submit">Submit</button>
      <div id="loginError">{valid ? null : <p>Passwords must match</p>}</div>
    </form>
  );
}
