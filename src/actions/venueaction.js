"use strict"//gets the api info
import axios from 'axios'

export function fetchVenues(){
  return function(dispatch){
    axios.get('/api/yelp/20036')
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
            payload:err
          }
        )
      })
  }

}
