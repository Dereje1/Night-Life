"use strict"//gets the api info
import axios from 'axios'

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
export function cancelVenue(venueToCancel){
  console.log(venueToCancel)
  return function(dispatch){
    axios.delete('/api/cancel/'+JSON.stringify(venueToCancel))
      .then(function(response){
        dispatch(
          {
            type:"CANCEL_VENUE",
            payload:venueToCancel
          }
        )
      })
      .catch(function(err){
        dispatch(
          {
            type:"CANCEL_VENUE_ERROR",
            payload:[err]
          }
        )
      })
  }

}
export function getGoers(venueToGo){
  return function(dispatch){
    axios.get('/api/going',venueToGo)
      .then(function(response){
        dispatch(
          {
            type:"GET_VENUE_GOERS",
            payload:[response.data]
          }
        )
      })
      .catch(function(err){
        dispatch(
          {
            type:"GET_VENUE_GOERS_ERROR",
            payload:[err]
          }
        )
      })
  }

}
