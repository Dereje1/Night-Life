"use strict"
//mongoose shcema on what to store from yelp
var mongoose = require('mongoose');
var venueSchema = mongoose.Schema({
   yelpFullResult: {}
});

var Venues = mongoose.model('yelpVenues',venueSchema);
module.exports = Venues;
