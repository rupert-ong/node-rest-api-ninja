const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    type: 'GET'
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    type: 'POST'
  });
});

router.put('/:id', (req, res, next) => {
  res.status(200).json({
    type: 'PUT'
  });
});

router.delete('/:id', (req, res, next) => {
  res.status(200).json({
    type: 'DELETE'
  });
});

module.exports = router;