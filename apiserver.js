var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var axios = require('axios')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//APIs Start
var db = require('./models/db') //mongoose required schema

//Get all Polls/single poll or user defined polls
app.get('/yelp', function(req,res){
  console.log("proxy called!!")
  let location = req.params.loc
  let url="https://api.yelp.com/oauth2/token/"
  let pObject=JSON.stringify({
    'grant_type':"client_credentials",
    'client_id': process.env.YELP_ClIENT_ID,
    'client_secret': process.env.YELP_CLIENT_SECRET
  })
  axios.post(url,(pObject))
    .then(function(response){
      console.log(response.data)
       res.json({"yelp":response})
     })
    .catch(function(err){
      console.log(err)
      res.json({"yelp":err})
    })
})

//APIs end
app.listen(3001,function(err){
  if(err){
    console.log(err)
  }
  console.log("API Server is listening on port 3001")
})
