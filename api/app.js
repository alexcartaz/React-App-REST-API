'use strict';

// load modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

// load routes
const routes = require('./routes');
const { sequelize } = require('./models');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();

// enable all CORS requests
app.use(cors());

// setup morgan for http request logging
app.use(morgan('dev'));

// setup a friendly greeting for the root route init
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});


app.use(express.json());

//middleware for requests under /api
app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// since this is a simulated backend, use 5000 and web client will use 3000
app.set('port', process.env.PORT || 5000);

// test the db connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully');

  } catch (error) {
    console.error('Unable to connect to the database: ', error);
  }
})();

// synchronize models with sequelize, then start listening on port
sequelize.sync()
  .then(() => {
    const server = app.listen(app.get('port'), () => {
      console.log(`Express server is listening on port ${server.address().port}`);
    });
});
