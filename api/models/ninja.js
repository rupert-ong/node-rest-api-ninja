const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// GeoJson Convention (http://geojson.org/):
/*
  "geometry": {
    "type": "Point",
    "coordinates": [125.6, 10.1]
  },
*/

const GeoSchema = new Schema({
  type: {
    type: String,
    default: "Point"
  },
  coordinates: {
    type: [Number],
    // 2d sphere takes circumference and shape of
    // globe when mapping between 2 points (as opposed to 2d)
    index: "2dsphere"
  }
});

const NinjaSchema = new Schema({
  name: {
    type: String,
    required: [true | 'Name field is required']
  },
  rank: {
    type: String
  },
  available: {
    type: Boolean,
    default: false
  },
  geometry: GeoSchema
});

module.exports = mongoose.model('Ninja', NinjaSchema);
