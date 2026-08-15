import { useState, useEffect, useContext } from "react";
import authContext from "../Context/AuthContext.js";
import axios from "axios";
import "../Styles/Predictions.css";

export default function PredictionsPage() {
  const [predPage, setPredPage] = useState(0);
  const [predictions, setPredictions] = useState([]);
  const [nextPage, setNextPage] = useState(false);
  const { authInfo } = useContext(authContext);

  useEffect(() => {
    const getPredictions = async () => {
      try {
        const response = await axios.get("/predictions?predPage=${predPage}");
        setPredictions(response.data.preds);
        setNextPage(response.data.hasNextPage);
      } catch (error) {
        console.log(error);
      }
    };

    getPredictions();
  }, [predPage]);

  if (!authInfo.hasPredicted) {
    return (
      <div id="predictionsDiv">
        <p>Make your prediction in order to see what others picked.</p>
      </div>
    );
  }

  return (
    <div id="predictions">
      <h2>Predictions</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gender</th>
            <th>Due Date</th>
            <th>Height</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((pred) => (
            <tr key={pred._id}>
              <td>
                {pred.user.firstName} {pred.user.lastName}
              </td>
              <td>
                {pred.gender.charAt(0).toUpperCase() + pred.gender.slice(1)}
              </td>
              <td>{new Date(pred.date).toLocaleDateString()}</td>
              <td>{pred.height} in.</td>
              <td>
                {pred.pounds} lbs. {pred.ounces} oz.
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div id="pagination">
        <button
          onClick={() => setPredPage(predPage - 1)}
          disabled={predPage === 0}>
          Previous
        </button>

        <button onClick={() => setPredPage(predPage + 1)} disabled={!nextPage}>
          Next
        </button>
      </div>
    </div>
  );
}
