"use strict"//converts ip data to city and sends back as promise
var axios = require('axios')

module.exports = function(){
  return new Promise(function(resolve,reject){
    axios.get("http://api.ipstack.com/check?access_key="+process.env.IPSTACK)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(error){
        reject(error.response.data)
      })
  })
}
