// imports
const express = require('express');
const msgnrOrcRouter = require('./routes/MessengerOrchestratorRouter');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require("body-parser");

// init
const app = express()
dotenv.config();

//middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// use routes
app.use('/', msgnrOrcRouter);

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {console.log(`Server is listening on port: ${port}`)});