const cors = require("cors");
require("dotenv").config();
const frontEndlink = process.env.FRONTEND_URL;

console.log("frontend", frontEndlink);

var corsOptions = {
  origin: [frontEndlink],
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
