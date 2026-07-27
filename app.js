const express = require("express");
const routes = require("./routes/Routes");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db");
const corsMiddleware = require("./middleware/cors");

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(routes);

app.get("/", (req, res) => {
  res.send("Testing");
});

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(3000);
  } catch (error) {
    console.log(error);
  }
};

startServer();
