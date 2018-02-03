const express = require('express');
const app = express();

const ninjaRoutes = require('./api/routes/ninjas');

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