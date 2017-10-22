"use strict"//primary module to interact with client
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios')
var queryString = require('query-string');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

//Custom made modules
var yelptoken = require('./thirdpartyapis/yelptoken')//gets yelp token
var convertIp = require('./thirdpartyapis/iptocity')//converts IP to city

var app = express();
//need session to store yelp data, not storing than in db, note same session as user authentication should be split out??
app.use(session(
  { secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),//warning in node if this option is not included
    resave: true,
    saveUninitialized: true
  }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//APIs Start
var db = require('./models/db') //mongoose required common db
var going = require('./models/VenueGoers') // VenueGoers schema

app.get('/yelp/:loc', function(req,res){//gets yelp data for query or if no query ip/session data
    let headerObject = req.headers //need for ip
    let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
    ip = (ip === "::ffff:127.0.0.1") ? process.env.LOCAL_IP : ip //for local dev ip
    convertIp(ip).then(function(cityData){//first convert ip to city and then...
      let locationName
      if (req.params.loc === 'byip'){//check if client is searching with current location and / or refresh / authentication reroute
        //if previous search already in session just return that
        if(req.session.yelpVenues){res.json(req.session.yelpVenues); return;}
        //if no session stored just go by ip location and proceed to next promise
        locationName = cityData.city+","+cityData.region_name
      }
      else if(req.params.loc === 'byipforced'){//if forced ip button press then go with that
        locationName = cityData.city+","+cityData.region_name
      }
      else{//for a location query go with that
        locationName = req.params.loc
      }
      yelptoken().then(function(token){//get yelp token and then
        axios.get("https://api.yelp.com/v3/businesses/search?term=bars nightclubs&location="+locationName+"&limit=20",{
            headers:{"Authorization" : token.token_type+" "+token.access_token}
          })//pull yelp data
          .then(function(response) {
                 let venuesToAdd = {//reorganize yelp response, add original query
                   yelpFullResult:response.data,
                   originalRequest: locationName
                 }
                   req.session.yelpVenues = venuesToAdd //store search in sesssion
                   res.json(venuesToAdd);//send back to client
          })
          .catch(function(err){
            let errorToReact = {//reorganize error data so that client will understand/parse
              error:err.response.data,
              originalRequest: req.params.loc
            }
            res.json(errorToReact);//send yelp error
          });
      })
      .catch(function(err){//token getting error
        res.json(err)
      })
    })
    .catch(function(err){//ip to city error
      console.log(err)
    })

})
//use below to update venue goers data base
app.post('/yelp',function(req,res){//adding a venue goer
  let info=req.body;
  going.create(info,function(err,goerinfo){
    if(err){throw(err)}
    res.json(goerinfo)
  })
})

app.get('/going',function(req,res){//getting all venue goers
  let timediff = Date.now() - 86400000 //remove any going records older than 24hrs
  let rmvQuery = {timeStamp : { $lt : timediff} }
  going.remove(rmvQuery,function(err,old){//remove all expired data from db
    if(err){throw(err)}
    going.find({},function(err,allgoers){//get remaining goers data and send back to client
      if(err){throw(err)}
      res.json(allgoers)
    })
  })
})

app.delete('/cancel/:del', function(req,res){//deleting a venue goer
  var query = JSON.parse(req.params.del);//not param coming in as stringified json must reparse back or db will not understand, deletes by username + yelpID, also http DELETE requests do not work well with data sent in the body, worked with Advance Rest Client but not directly from react!!!
  going.remove(query, function(err, venue){
    if(err){
    throw err;
    }
    res.json(venue);
  })
})
//APIs end
app.listen(3001,function(err){
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
