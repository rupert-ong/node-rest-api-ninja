const express = require('express');
const morgan = require('morgan');
const app = express();

const ninjaRoutes = require('./api/routes/ninjas');

// Middleware
app.use(morgan('dev'));

// Set headers to prevent CORS errors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if(req.method === 'OPTIONS'){
    res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE');
    res.status(200).json({});
  }
  next();
});

// Routes
app.use('/api/ninjas', ninjaRoutes);

// 404 Error
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// Error Handling
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;