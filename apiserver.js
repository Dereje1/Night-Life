var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios')
var queryString = require('query-string');
var yelptoken = require('./thirdpartyapis/yelptoken')
var convertIp = require('./thirdpartyapis/iptocity')
// now just use the cache
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var app = express();
app.use(session(
  { secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),//warning in node if this option is not included
    resave: true,
    saveUninitialized: true
  }
)); // session secret
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//APIs Start
var db = require('./models/db') //mongoose required schema
var going = require('./models/VenueGoers')
//Get all Polls/single poll or user defined polls
app.get('/yelp/:loc', function(req,res){

    let headerObject = req.headers //need for ip
    let ip = (headerObject['x-forwarded-for']||req.socket.remoteAddress).split(",")[0];
    ip = (ip === "::ffff:127.0.0.1") ? process.env.LOCAL_IP : ip
    convertIp(ip).then(function(cityData){
      let locationName
      if (req.params.loc === 'byip'){
        if(req.session.yelpVenues){res.json(req.session.yelpVenues); return;}
        //if no session stored just go by ip location
        locationName = cityData.city+","+cityData.region_name
      }
      else if(req.params.loc === 'byipforced'){
        locationName = cityData.city+","+cityData.region_name
      }
      else{
        locationName = req.params.loc
      }
      yelptoken().then(function(token){
        axios.get("https://api.yelp.com/v3/businesses/search?term=bars nightclubs&location="+locationName+"&limit=20",{
            headers:{"Authorization" : token.token_type+" "+token.access_token}
          })
          .then(function(response) {
                 let venuesToAdd = {
                   yelpFullResult:response.data,
                   originalRequest: locationName
                 }
                   req.session.yelpVenues = venuesToAdd
                   res.json(venuesToAdd);
          })
          .catch(function(err){
            let errorToReact = {
              error:err.response.data,
              originalRequest: req.params.loc
            }
            res.json(errorToReact);
          });
      })
      .catch(function(err){
        res.json(err)
      })
    })
    .catch(function(err){
      console.log(err)
    })

})
app.post('/yelp',function(req,res){
  let info=req.body;
  going.create(info,function(err,goerinfo){
    if(err){throw(err)}
    res.json(goerinfo)
  })
})

app.get('/going',function(req,res){
  let query ={}
  let timediff = Date.now() - 86400000 //remove any going records older than 24hrs
  let rmvQuery = {timeStamp : { $lt : timediff} }
  going.remove(rmvQuery,function(err,old){
    if(err){throw(err)}
    going.find({},function(err,allgoers){
      if(err){throw(err)}
      res.json(allgoers)
    })
  })
})

app.delete('/cancel/:del', function(req,res){
  var query = JSON.parse(req.params.del);
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
