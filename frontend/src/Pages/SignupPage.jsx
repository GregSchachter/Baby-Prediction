import { useState } from "react";
import "../Styles/Signup.css";
import axios from "axios";

const SignupPage = () => {
  const [info, setInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setInfo((i) => ({
      ...i,
      [name]: value,
    }));
  };

  const url = import.meta.env.VITE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const signupData = {
      email: info.email,
      password: info.password,
      firstName: info.firstName,
      lastName: info.lastName,
    };
    try {
      const res = await axios.post(`${url}/signup`, signupData, {
        withCredentials: true,
        timeout: 120000,
      });
    } catch (error) {
      console.log(error);
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
      </form>
    </div>
  );
};

export default SignupPage;
