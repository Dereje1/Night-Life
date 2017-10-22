"use strict"//actions for user tha is going/canceling to/from a venue and also gets all people that are going to all venues from db
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
export function getGoers(){//get all users that are going to all venues
  return function(dispatch){
    axios.get('/api/going')
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
