import "../Styles/Home.css";

const HomePage = () => {
  return (
    <div id="homePage">
      <h1>PLACE YOUR BET!</h1>
      <div>
        <h2>Make your prediction for:</h2>
        <ul>
          <li>Gender</li>
          <li>Due Date</li>
          <li>Height</li>
          <li>Weight</li>
        </ul>
      </div>
      <div>
        <h2>How it works!</h2>
        <ol>
          <li>Create an account</li>
          <li>Enter your prediction</li>
          <li>See the predictions</li>
        </ol>
      </div>
    </div>
  );
};

export default HomePage;
