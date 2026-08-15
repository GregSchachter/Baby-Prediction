import { useState } from "react";
import axios from "axios";
import "../Styles/ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    try {
      // Send backend response
      const res = await axios.post(
        "/api/forgotpassword",
        { email },
        {
          withCredentials: true,
          timeout: 12000,
        },
      );

      setSent(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form id="forgotForm" onSubmit={handleSubmit}>
      {!sent ? (
        <>
          <h2>Forgot Password</h2>
          <label htmlFor="email">Enter Email</label>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
          />
          {!submitted ? (
            <button type="submit">Submit</button>
          ) : (
            <p>Submitting...</p>
          )}{" "}
        </>
      ) : (
        <p>
          If an account exists for that email, we've sent a password reset link.
        </p>
      )}
    </form>
  );
}
