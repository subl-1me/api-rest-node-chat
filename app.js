require("dotenv").config();
require("./services/");
const cors = require("cors");
const express = require("express");
const mongoDb = require("./configs/mongo");
const app = express();
const errorHandler = require("./middlewares/errorHandler");

const corsOptions = {
  origin: "*", // O especifica el dominio permitido, ej: 'http://tudominio.com'
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api", require("./routes"));

// Middlewarres
app.use(errorHandler);

// Mongo db connected
mongoDb.dbConnect();

module.exports = app;
