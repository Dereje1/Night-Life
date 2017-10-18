var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios')
var queryString = require('query-string');
var yelptoken = require('./yelptoken')
// now just use the cache

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//APIs Start
var db = require('./models/db') //mongoose required schema

//Get all Polls/single poll or user defined polls
app.get('/yelp/:loc', function(req,res){
    console.log(req.params.loc)
    yelptoken().then(function(token){
      axios.get("https://api.yelp.com/v3/businesses/search?term=bars nightclubs&location="+req.params.loc+"&limit=10",{
          headers:{"Authorization" : token.token_type+" "+token.access_token}
        })
        .then(function(response) {
         res.json(response.data);
        })
        .catch(function(err){
          res.json(err);
        });
    })
    .catch(function(err){
      res.json(err)
    })
})

//APIs end
app.listen(3001,function(err){
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
