require('dotenv').config();
require('./services/');
const cors = require('cors');
const express = require('express');
const mongoDb = require('./configs/mongo');
const app = express();
const errorHandler = require('./middlewares/errorHandler');

app.use(cors());
app.use(express.json());

// Routes
app.use('/api', require('./routes'));

// Middlewarres
app.use(errorHandler);

// Mongo db connected
mongoDb.dbConnect();

module.exports = app;