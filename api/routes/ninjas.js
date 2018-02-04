const express = require('express');
const router = express.Router();

const Ninja = require('../models/ninja');
const port = process.env.PORT || 3000;

router.get('/', (req, res, next) => {
  // Sample code to get all ninjas
  // Ninja.find({}).exec().then(result => res.status(200).json(result));
  const maxDistanceThreshold = 100000; // in metres

  if (isNaN(parseFloat(req.query.lng)) || isNaN(parseFloat(req.query.lat))) {
    const err = new Error('Request query parameters lng and lat are required and must be numerical');
    err.status = 422;
    return next(err);
  }
  Ninja.aggregate().near({
    near: { type: "Point", coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)] },
    distanceField: 'dist.calculated',
    maxDistance: maxDistanceThreshold,
    spherical: true
  }).exec()
    .then(result => {
      res.status(200).json({
        message: 'Ninjas found near coordinates',
        maxDistance: maxDistanceThreshold,
        longitude: req.query.lng,
        latitude: req.query.lat,
        count: result.length,
        ninjas: result
      });
    }).catch(err => { next(err) });
});

router.get('/:id', (req, res, next) => {
  Ninja.findById(req.params.id)
    .select('_id name rank available geometry')
    .exec()
    .then(result => {
      if (!result) {
        const err = new Error('Ninja not found');
        err.status = 404;
        return next(err);
      }
      res.status(200).json({
        ...result._doc
      });
    })
    .catch(err => { next(err); });
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
  const id = req.params.id;
  Ninja.findByIdAndUpdate(id, req.body)
    .exec()
    .then(result => {
      if (!result) {
        const err = new Error('Ninja not found');
        err.status = 404;
        return next(err);
      }
      // Get updated ninja document
      Ninja.findById(id)
        .select('_id name rank available geometry')
        .exec()
        .then(result => {
          res.status(200).json({
            message: 'Ninja updated',
            ninja: {
              ...result._doc
            },
            request: {
              type: 'GET',
              url: `http://localhost/${port}/api/ninjas/${result._id}`,
            }
          });
        });
    })
    .catch(err => { next(err); });
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  Ninja.findByIdAndRemove({ _id: id })
    .select('_id name rank available geometry')
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
    .catch(err => { next(err); });
});

module.exports = router;