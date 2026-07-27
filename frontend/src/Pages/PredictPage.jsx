import { useState } from "react";
import "../Styles/Predict.css";
import axios from "axios";

export default function PredictPage() {
  const [prediction, setPrediction] = useState({
    gender: "male",
    date: "",
    height: "",
    weight: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPrediction((i) => ({
      ...i,
      [name]: value,
    }));
  };

  const url = import.meta.env.VITE_URL;
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/predict`,
        {
          gender: prediction.gender,
          date: prediction.date,
          height: prediction.height,
          weight: prediction.weight,
        },
        {
          withCredentials: true,
        },
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form id="predForm" onSubmit={handleSubmit}>
        <h2>Make Your Prediction!</h2>
        <div className="radioGroup">
          <label
            className={`radioLabel ${prediction.gender === "male" ? "maleSelected" : ""}
          }`}>
            Male
            <input
              className="predRadio"
              id="maleRadio"
              type="radio"
              name="gender"
              value="male"
              checked={prediction.gender === "male"}
              onChange={handleChange}></input>
          </label>
          <label
            className={`radioLabel ${prediction.gender === "female" ? "femaleSelected" : ""}
          }`}>
            Female
            <input
              className="predRadio"
              id="femaleRadio"
              type="radio"
              name="gender"
              value="female"
              checked={prediction.gender === "female"}
              onChange={handleChange}></input>
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
              onChange={handleChange}></input>
          </label>
          <label>
            Height (in)
            <input
              type="number"
              placeholder="Height"
              id="heightInput"
              name="height"
              value={prediction.height}
              onChange={handleChange}></input>
          </label>
          <label>
            Weight (oz)
            <input
              type="number"
              placeholder="Weight"
              name="weight"
              id="weightInput"
              value={prediction.weight}
              onChange={handleChange}></input>
          </label>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}
