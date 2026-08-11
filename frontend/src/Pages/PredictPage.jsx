import { useState } from "react";
import "../Styles/Predict.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import authContext from "../Context/AuthContext";

export default function PredictPage() {
  const [valid, setValid] = useState(true);
  const { authInfo, setAuthInfo } = useContext(authContext);
  const [firstPrediction, setFirstPrediction] = useState(true);
  const navigate = useNavigate();
  const [prediction, setPrediction] = useState({
    gender: "male",
    date: "",
    height: "",
    pounds: "",
    ounces: "",
  });

  const handleChange = (e) => {
    setValid(true);
    const { name, value } = e.target;

    setPrediction((i) => ({
      ...i,
      [name]: value,
    }));
  };

  const url = import.meta.env.VITE_API_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/predict`,
        {
          gender: prediction.gender,
          date: prediction.date,
          height: prediction.height,
          pounds: prediction.pounds,
          ounces: prediction.ounces,
        },
        {
          withCredentials: true,
        },
      );

      setAuthInfo((a) => ({
        ...a,
        hasPredicted: true,
      }));

      navigate("/predictions");
    } catch (error) {
      setValid(false);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${url}/predict`,
        {
          gender: prediction.gender,
          date: prediction.date,
          height: prediction.height,
          pounds: prediction.pounds,
          ounces: prediction.ounces,
        },
        {
          withCredentials: true,
        },
      );
      navigate("/predictions");
    } catch (error) {
      setValid(false);
    }
  };

  return (
    <div>
      <form id="predForm" onSubmit={handleSubmit}>
        <h2>Make Your Prediction!</h2>
        <div className="radioGroup">
          <label
            className={`radioLabel ${prediction.gender === "male" ? "maleSelected" : ""}
          }`}
          >
            Male
            <input
              className="predRadio"
              id="maleRadio"
              type="radio"
              name="gender"
              value="male"
              checked={prediction.gender === "male"}
              onChange={handleChange}
            ></input>
          </label>
          <label
            className={`radioLabel ${prediction.gender === "female" ? "femaleSelected" : ""}
          }`}
          >
            Female
            <input
              className="predRadio"
              id="femaleRadio"
              type="radio"
              name="gender"
              value="female"
              checked={prediction.gender === "female"}
              onChange={handleChange}
            ></input>
          </label>
        </div>
        <div id="predInputs">
          <label>
            Due Date
            <input
              type="date"
              name="date"
              id="dateInput"
              placeholder="Due Date"
              value={prediction.date}
              onChange={handleChange}
            ></input>
          </label>
          <label>
            Height (in)
            <input
              type="number"
              placeholder="Height"
              id="heightInput"
              name="height"
              value={prediction.height}
              onChange={handleChange}
              min={1}
            ></input>
          </label>
          <label>
            Weight (lbs)
            <div>
              <input
                type="number"
                placeholder="Lbs"
                name="pounds"
                id="weightLbsInput"
                value={prediction.pounds}
                onChange={handleChange}
                min={1}
              ></input>
              <input
                type="number"
                placeholder="Oz"
                name="ounces"
                id="weightOzInput"
                value={prediction.ounces}
                onChange={handleChange}
                min={0}
                max={15}
              ></input>
            </div>
          </label>
        </div>
        {authInfo.hasPredicted ? (
          <button type="button" onClick={handleClick}>
            Update Prediction
          </button>
        ) : (
          <button type="submit">Submit</button>
        )}
        <div id="loginError">
          {valid ? null : <p>Everything is required</p>}
        </div>
      </form>
    </div>
  );
}
