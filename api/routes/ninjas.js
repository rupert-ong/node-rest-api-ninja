const express = require('express');
const router = express.Router();

const Ninja = require('../models/ninja');
const port = process.env.PORT || 3000;

router.get('/', (req, res, next) => {
  res.status(200).json({
    type: 'GET'
  });
});

router.post('/', (req, res, next) => {
  // Model.create is shorthand for new Model(req.body | {...}) and save()
  Ninja.create(req.body)
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Ninja created',
        ninja: {
          ...result._doc
        },
        request: {
          type: 'GET',
          url: `http://localhost/${port}/api/ninjas/${result._id}`
        }
      })
    })
    .catch(err => {
      err.status = 422;
      next(err);
    });
});

router.put('/:id', (req, res, next) => {
  res.status(200).json({
    type: 'PUT'
  });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Ninja.findByIdAndRemove({ _id: id })
    .exec()
    .then(result => {
      if (!result) {
        const err = new Error('Ninja not found');
        err.status = 404;
        return next(err);
      }
      res.status(200).json({
        message: 'Ninja deleted',
        ninja: {
          ...result._doc
        },
        request: {
          type: 'POST',
          description: 'Create a ninja',
          url: `http://localhost/${port}/api/ninjas/`,
          body: {
            name: 'String',
            rank: 'String',
            available: 'Boolean'
          }
        }
      });
    })
    .catch(err => {
      next(err);
    })
});

module.exports = router;