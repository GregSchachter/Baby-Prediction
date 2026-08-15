const express = require("express");
const routes = require("./routes/Routes");
const cookieParser = require("cookie-parser");
const connectToDb = require("./db");
const corsMiddleware = require("./middleware/cors");
const path = require("path");

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.get("/check-cookie", (req, res) => {
  console.log("JWT Cookie", req.cookies.jwt);

  res.json({
    hasCookie: !!req.cookies.jwt,
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(routes);

app.use(express.static(path.join(__dirname, "frontend/dist")));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

const startServer = async () => {
  try {
    await connectToDb();
    app.listen(process.env.PORT || 3000);
  } catch (error) {
    console.log(error);
  }
};

startServer();
