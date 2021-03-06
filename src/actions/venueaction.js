"use strict"//gets venues from yelp api and sends directly to reducer no db interaction in this route
import axios from 'axios'

export function fetchVenues(vquery){
  if(!vquery){vquery="byip"}
  return function(dispatch){
    axios.get('/api/yelp/'+vquery)
      .then(function(response){
        dispatch(
          {
            type:"GET_VENUES",
            payload:[response.data]
          }
        )
      })
      .catch(function(err){
        dispatch(
          {
            type:"GET_VENUES_ERROR",
            payload:[err]
          }
        )
      })
  }

}
