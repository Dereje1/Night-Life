"use strict"//converts ip data to city and sends back as promise
var axios = require('axios')

module.exports = function(ip){
  const ipStackURL = ip === 'local' ? 
  "http://api.ipstack.com/check?access_key="+process.env.IPSTACK
  :
  "http://api.ipstack.com/"+ ip + "?access_key="+process.env.IPSTACK
  return new Promise(function(resolve,reject){
    axios.get(ipStackURL)
      .then(function(response){
        resolve(response.data)
      })
      .catch(function(error){
        reject(error.response.data)
      })
  })
}
