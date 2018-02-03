const express = require('express');
const app = express();

const ninjaRoutes = require('./api/routes/ninjas');

app.use('/api/ninjas', ninjaRoutes);

module.exports = app;