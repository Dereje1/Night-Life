"use strict"//gets the api info
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
export function goToVenue(venueToGo){
  return function(dispatch){
    axios.post('/api/yelp/',venueToGo)
      .then(function(response){
        dispatch(
          {
            type:"GO_TO_VENUE",
            payload:[response.data]
          }
        )
      })
      .catch(function(err){
        dispatch(
          {
            type:"GO_TO_VENUE_ERROR",
            payload:[err]
          }
        )
      })
  }

}
