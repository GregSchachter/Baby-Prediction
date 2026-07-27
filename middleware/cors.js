const cors = require("cors");

var corsOptions = {
  origin: ["http://localhost:5173", "127.0.0.1.5173"],
  allowedHeaders: ["Content-Type", "Authorization"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = cors(corsOptions);
